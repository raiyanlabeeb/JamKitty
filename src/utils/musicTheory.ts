import { CHROMATIC_NOTES, NOTE_INDEX, STANDARD_TUNING } from '../data/notes';
import { INTERVAL_NAMES } from '../data/scales';
import type { ChordShape, DiatonicChord, FretNote, NoteName } from '../types';

const NUM_STRINGS = 6;
const MAX_FRET = 14;

export function getFretboardScaleNotes(
  root: NoteName,
  intervals: number[],
  position?: number | null,
): FretNote[] {
  const rootIndex = NOTE_INDEX[root];
  const intervalSet = new Set(intervals);
  const result: FretNote[] = [];
  const minFret = position ?? 0;
  const maxFret = position != null ? position + 4 : MAX_FRET;

  for (let s = 0; s < NUM_STRINGS; s++) {
    const openIndex = NOTE_INDEX[STANDARD_TUNING[s]];
    for (let f = minFret; f <= maxFret; f++) {
      const noteIndex = (openIndex + f) % 12;
      const interval = (noteIndex - rootIndex + 12) % 12;
      if (intervalSet.has(interval)) {
        result.push({
          string: s,
          fret: f,
          note: CHROMATIC_NOTES[noteIndex],
          isRoot: interval === 0,
          intervalName: INTERVAL_NAMES[interval],
        });
      }
    }
  }
  return result;
}

export function getFretboardChordNotes(chord: ChordShape): FretNote[] {
  const rootIndex = NOTE_INDEX[chord.root];
  return chord.frets
    .map((fret, s): FretNote | null => {
      if (fret === -1) return null;
      const noteIndex = (NOTE_INDEX[STANDARD_TUNING[s]] + fret) % 12;
      return {
        string: s,
        fret,
        note: CHROMATIC_NOTES[noteIndex],
        isRoot: noteIndex === rootIndex,
      };
    })
    .filter((n): n is FretNote => n !== null);
}

export function getScaleNoteNames(root: NoteName, intervals: number[]): NoteName[] {
  const rootIndex = NOTE_INDEX[root];
  return intervals.map(i => CHROMATIC_NOTES[(rootIndex + i) % 12]);
}

export function getChordNoteNames(chord: ChordShape): NoteName[] {
  const seen = new Set<NoteName>();
  const result: NoteName[] = [];
  chord.frets.forEach((fret, s) => {
    if (fret === -1) return;
    const note = CHROMATIC_NOTES[(NOTE_INDEX[STANDARD_TUNING[s]] + fret) % 12];
    if (!seen.has(note)) {
      seen.add(note);
      result.push(note);
    }
  });
  return result;
}

export function getMutedStrings(chord: ChordShape): Set<number> {
  const muted = new Set<number>();
  chord.frets.forEach((fret, s) => { if (fret === -1) muted.add(s); });
  return muted;
}

const ROMANS_UPPER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const ROMANS_LOWER = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

export function getDiatonicChords(root: NoteName, intervals: number[]): DiatonicChord[] {
  const n = intervals.length;
  if (n < 7) return []; // only well-defined for heptatonic scales

  const noteNames = intervals.map(iv => CHROMATIC_NOTES[(NOTE_INDEX[root] + iv) % 12]);

  return intervals.map((iv, i) => {
    const thirdIdx = (i + 2) % n;
    const fifthIdx = (i + 4) % n;
    const third = intervals[thirdIdx] + (thirdIdx < i ? 12 : 0) - iv;
    const fifth  = intervals[fifthIdx] + (fifthIdx < i ? 12 : 0) - iv;

    let quality: DiatonicChord['quality'];
    if      (third === 4 && fifth === 7) quality = 'major';
    else if (third === 3 && fifth === 7) quality = 'minor';
    else if (third === 3 && fifth === 6) quality = 'diminished';
    else if (third === 4 && fifth === 8) quality = 'augmented';
    else quality = third >= 4 ? 'major' : 'minor';

    const roman = (quality === 'major' || quality === 'augmented')
      ? ROMANS_UPPER[i] + (quality === 'augmented' ? '+' : '')
      : ROMANS_LOWER[i] + (quality === 'diminished' ? '°' : '');

    return {
      degree: i,
      roman,
      root: noteNames[i],
      quality,
      notes: [noteNames[i], noteNames[thirdIdx], noteNames[fifthIdx]],
    };
  });
}

export function getChordQualityIntervals(quality: DiatonicChord['quality']): number[] {
  switch (quality) {
    case 'major':      return [0, 4, 7];
    case 'minor':      return [0, 3, 7];
    case 'diminished': return [0, 3, 6];
    case 'augmented':  return [0, 4, 8];
  }
}
