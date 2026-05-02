import type { NoteName } from '../types';

export const CHROMATIC_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

// Standard tuning: low E to high E
export const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

export const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];

export const NOTE_INDEX: Record<NoteName, number> = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5,
  'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
};

export function getNoteAtFret(openNote: NoteName, fret: number): NoteName {
  return CHROMATIC_NOTES[(NOTE_INDEX[openNote] + fret) % 12];
}
