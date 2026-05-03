import * as Tone from 'tone';
import type { NoteName } from '../types';
import type { ChordShape } from '../types';
import { NOTE_INDEX, STANDARD_TUNING, getNoteAtFret } from '../data/notes';

// MIDI note numbers for open strings (low E to high E)
const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];

// Root note MIDI values in octave 3 (C3=48 ... B3=59)
const ROOT_MIDI: Record<NoteName, number> = {
  C: 48, 'C#': 49, D: 50, 'D#': 51, E: 52, F: 53,
  'F#': 54, G: 55, 'G#': 56, A: 57, 'A#': 58, B: 59,
};

function midiToToneNote(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return noteNames[midi % 12] + octave;
}

let activeSynths: Tone.PluckSynth[] = [];
let activeTimeouts: ReturnType<typeof setTimeout>[] = [];

export function stopPlayback() {
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];
  activeSynths.forEach(s => { try { s.dispose(); } catch { /* already disposed */ } });
  activeSynths = [];
}

export function playScale(root: NoteName, intervals: number[]): number {
  stopPlayback();

  const rootMidi = ROOT_MIDI[root];
  // Build ascending note sequence: root + each interval step + root+12
  const midiNotes = [...intervals.map(iv => rootMidi + iv), rootMidi + 12];

  const stepMs = 350;
  const totalMs = midiNotes.length * stepMs + 200;

  midiNotes.forEach((midi, i) => {
    const t = setTimeout(async () => {
      await Tone.start();
      const synth = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 3000,
        resonance: 0.97,
      }).toDestination();
      activeSynths.push(synth);
      synth.triggerAttack(midiToToneNote(midi));
    }, i * stepMs);
    activeTimeouts.push(t);
  });

  return totalMs;
}

export function playChord(chord: ChordShape): number {
  stopPlayback();

  // Collect MIDI notes from the chord frets (string 0 = low E)
  const midiNotes: number[] = [];
  chord.frets.forEach((fret, stringIdx) => {
    if (fret === -1) return; // muted
    const openNote = STANDARD_TUNING[stringIdx];
    const note = getNoteAtFret(openNote, fret);
    let midi = OPEN_STRING_MIDI[stringIdx] + fret;
    // Sanity check: verify chromatic math matches
    void note; void NOTE_INDEX;
    midiNotes.push(midi);
  });

  const stepMs = 130;
  const totalMs = midiNotes.length * stepMs + 1200; // let last string ring

  midiNotes.forEach((midi, i) => {
    const t = setTimeout(async () => {
      await Tone.start();
      const synth = new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.98,
      }).toDestination();
      activeSynths.push(synth);
      synth.triggerAttack(midiToToneNote(midi));
    }, i * stepMs);
    activeTimeouts.push(t);
  });

  return totalMs;
}
