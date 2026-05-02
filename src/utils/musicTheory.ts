import { CHROMATIC_NOTES, NOTE_INDEX, STANDARD_TUNING } from '../data/notes';
import { INTERVAL_NAMES } from '../data/scales';
import type { ChordShape, FretNote, NoteName } from '../types';

const NUM_STRINGS = 6;
const MAX_FRET = 14;

export function getFretboardScaleNotes(root: NoteName, intervals: number[]): FretNote[] {
  const rootIndex = NOTE_INDEX[root];
  const intervalSet = new Set(intervals);
  const result: FretNote[] = [];

  for (let s = 0; s < NUM_STRINGS; s++) {
    const openIndex = NOTE_INDEX[STANDARD_TUNING[s]];
    for (let f = 0; f <= MAX_FRET; f++) {
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
