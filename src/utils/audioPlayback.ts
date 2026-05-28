import * as Tone from 'tone';
import type { DiatonicChord, NoteName } from '../types';
import type { ChordShape } from '../types';
import { STANDARD_TUNING } from '../data/notes';
import { getChordQualityIntervals } from './musicTheory';

const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];

const ROOT_MIDI: Record<NoteName, number> = {
  C: 48, 'C#': 49, D: 50, 'D#': 51, E: 52, F: 53,
  'F#': 54, G: 55, 'G#': 56, A: 57, 'A#': 58, B: 59,
};

function midiToToneNote(midi: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return names[midi % 12] + (Math.floor(midi / 12) - 1);
}

// ── Acoustic guitar sampler ──────────────────────────────────────────────────

let sampler: Tone.Sampler | null = null;
let samplerReady = false;
let initStarted = false;

function initSampler() {
  if (initStarted) return;
  initStarted = true;
  const giveUp = setTimeout(() => { /* samplerReady stays false → fallback */ }, 10_000);
  sampler = new Tone.Sampler({
    urls: {
      A2: 'A2.mp3',  A3: 'A3.mp3',  A4: 'A4.mp3',
      C3: 'C3.mp3',  C4: 'C4.mp3',  C5: 'C5.mp3',
      'D#2': 'Ds2.mp3', 'D#3': 'Ds3.mp3', 'D#4': 'Ds4.mp3',
      'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3', 'F#4': 'Fs4.mp3',
    },
    baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/',
    onload: () => { clearTimeout(giveUp); samplerReady = true; },
    onerror: () => { clearTimeout(giveUp); },
  }).toDestination();
}

initSampler();

// ── PluckSynth fallback ──────────────────────────────────────────────────────

let reverb: Tone.Reverb | null = null;
let eq: Tone.EQ3 | null = null;

async function getFallback(): Promise<Tone.EQ3> {
  if (eq) return eq;
  reverb = new Tone.Reverb({ decay: 2.2, preDelay: 0.012, wet: 0.22 });
  eq = new Tone.EQ3({ low: 3, mid: -1, high: -6 });
  eq.connect(reverb);
  reverb.toDestination();
  await reverb.generate();
  return eq;
}
getFallback().catch(() => {});

// ── Playback state ───────────────────────────────────────────────────────────

let activeSynths: Tone.PluckSynth[] = [];
let activeTimeouts: ReturnType<typeof setTimeout>[] = [];

export function stopPlayback() {
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];
  activeSynths.forEach(s => { try { s.dispose(); } catch { /* already disposed */ } });
  activeSynths = [];
  if (sampler && samplerReady) {
    try { sampler.releaseAll(); } catch { /* ignore */ }
  }
}

async function scheduleNotes(midiNotes: number[], stepMs: number, durationS: number) {
  await Tone.start();
  if (!samplerReady) await getFallback();

  midiNotes.forEach((midi, i) => {
    const t = setTimeout(() => {
      if (samplerReady && sampler) {
        sampler!.triggerAttackRelease(midiToToneNote(midi), durationS);
      } else if (eq) {
        const synth = new Tone.PluckSynth({ attackNoise: 4.5, dampening: 3200, resonance: 0.975 });
        synth.connect(eq);
        activeSynths.push(synth);
        synth.triggerAttack(midiToToneNote(midi));
      }
    }, i * stepMs);
    activeTimeouts.push(t);
  });
}

// ── Public API ───────────────────────────────────────────────────────────────

export function playScale(root: NoteName, intervals: number[]): number {
  stopPlayback();
  const rootMidi = ROOT_MIDI[root];
  const notes = [...intervals.map(iv => rootMidi + iv), rootMidi + 12];
  scheduleNotes(notes, 330, 0.7);
  return notes.length * 330 + 400;
}

export function playChord(chord: ChordShape): number {
  stopPlayback();
  const notes: number[] = [];
  chord.frets.forEach((fret, s) => { if (fret !== -1) notes.push(OPEN_STRING_MIDI[s] + fret); });
  scheduleNotes(notes, 110, 2.5);
  return notes.length * 110 + 1400;
}

export function playDiatonicChord(root: NoteName, quality: DiatonicChord['quality']): number {
  stopPlayback();
  const intervals = getChordQualityIntervals(quality);
  const rootMidi = ROOT_MIDI[root];
  const notes = [rootMidi - 12, ...intervals.map(iv => rootMidi + iv)].sort((a, b) => a - b);
  scheduleNotes(notes, 100, 2.0);
  return notes.length * 100 + 1200;
}

export function startProgressionLoop(
  chords: ChordShape[],
  bpm: number,
  onChordChange: (index: number) => void,
): () => void {
  let stopped = false;
  let currentIdx = 0;
  const msPerChord = Math.round((60_000 / bpm) * 2);
  const stepMs = 80;
  const localTimeouts: ReturnType<typeof setTimeout>[] = [];

  async function init() {
    await Tone.start();
    if (!samplerReady) await getFallback();
    tick();
  }

  function tick() {
    if (stopped || chords.length === 0) return;

    const chord = chords[currentIdx];
    onChordChange(currentIdx);
    currentIdx = (currentIdx + 1) % chords.length;

    const notes: number[] = [];
    chord.frets.forEach((fret, s) => { if (fret !== -1) notes.push(OPEN_STRING_MIDI[s] + fret); });

    const durS = (msPerChord / 1000) * 0.85;
    notes.forEach((midi, i) => {
      const t = setTimeout(() => {
        if (stopped) return;
        if (samplerReady && sampler) {
          sampler!.triggerAttackRelease(midiToToneNote(midi), durS);
        } else if (eq) {
          const synth = new Tone.PluckSynth({ attackNoise: 4.5, dampening: 3200, resonance: 0.975 });
          synth.connect(eq);
          activeSynths.push(synth);
          synth.triggerAttack(midiToToneNote(midi));
        }
      }, i * stepMs);
      localTimeouts.push(t);
    });

    localTimeouts.push(setTimeout(tick, msPerChord));
  }

  init();

  return () => {
    stopped = true;
    localTimeouts.forEach(clearTimeout);
    if (sampler && samplerReady) { try { sampler.releaseAll(); } catch { /* ignore */ } }
    activeSynths.forEach(s => { try { s.dispose(); } catch { /* ignore */ } });
    activeSynths = [];
  };
}

export { STANDARD_TUNING };
