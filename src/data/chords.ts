import type { ChordShape } from '../types';

export const CHORD_SHAPES: ChordShape[] = [
  // ── Major ──────────────────────────────────────────────────────────────────
  { id: 'C',   name: 'C',   root: 'C',   frets: [-1, 3, 2, 0, 1, 0] },
  { id: 'C#',  name: 'C#',  root: 'C#',  frets: [-1, 4, 6, 6, 6, 4] },
  { id: 'D',   name: 'D',   root: 'D',   frets: [-1, -1, 0, 2, 3, 2] },
  { id: 'D#',  name: 'D#',  root: 'D#',  frets: [-1, 6, 8, 8, 8, 6] },
  { id: 'E',   name: 'E',   root: 'E',   frets: [0, 2, 2, 1, 0, 0] },
  { id: 'F',   name: 'F',   root: 'F',   frets: [1, 3, 3, 2, 1, 1] },
  { id: 'F#',  name: 'F#',  root: 'F#',  frets: [2, 4, 4, 3, 2, 2] },
  { id: 'G',   name: 'G',   root: 'G',   frets: [3, 2, 0, 0, 0, 3] },
  { id: 'G#',  name: 'G#',  root: 'G#',  frets: [4, 6, 6, 5, 4, 4] },
  { id: 'A',   name: 'A',   root: 'A',   frets: [-1, 0, 2, 2, 2, 0] },
  { id: 'A#',  name: 'A#',  root: 'A#',  frets: [-1, 1, 3, 3, 3, 1] },
  { id: 'B',   name: 'B',   root: 'B',   frets: [-1, 2, 4, 4, 4, 2] },

  // ── Minor ──────────────────────────────────────────────────────────────────
  { id: 'Cm',  name: 'Cm',  root: 'C',   frets: [-1, 3, 5, 5, 4, 3] },
  { id: 'C#m', name: 'C#m', root: 'C#',  frets: [-1, 4, 6, 6, 5, 4] },
  { id: 'Dm',  name: 'Dm',  root: 'D',   frets: [-1, -1, 0, 2, 3, 1] },
  { id: 'D#m', name: 'D#m', root: 'D#',  frets: [-1, 6, 8, 8, 7, 6] },
  { id: 'Em',  name: 'Em',  root: 'E',   frets: [0, 2, 2, 0, 0, 0] },
  { id: 'Fm',  name: 'Fm',  root: 'F',   frets: [1, 3, 3, 1, 1, 1] },
  { id: 'F#m', name: 'F#m', root: 'F#',  frets: [2, 4, 4, 2, 2, 2] },
  { id: 'Gm',  name: 'Gm',  root: 'G',   frets: [3, 5, 5, 3, 3, 3] },
  { id: 'G#m', name: 'G#m', root: 'G#',  frets: [4, 6, 6, 4, 4, 4] },
  { id: 'Am',  name: 'Am',  root: 'A',   frets: [-1, 0, 2, 2, 1, 0] },
  { id: 'A#m', name: 'A#m', root: 'A#',  frets: [-1, 1, 3, 3, 2, 1] },
  { id: 'Bm',  name: 'Bm',  root: 'B',   frets: [-1, 2, 4, 4, 3, 2] },

  // ── Dominant 7th ───────────────────────────────────────────────────────────
  { id: 'C7',  name: 'C7',  root: 'C',   frets: [-1, 3, 2, 3, 1, 0] },
  { id: 'C#7', name: 'C#7', root: 'C#',  frets: [-1, 4, 6, 4, 6, 4] },
  { id: 'D7',  name: 'D7',  root: 'D',   frets: [-1, -1, 0, 2, 1, 2] },
  { id: 'D#7', name: 'D#7', root: 'D#',  frets: [-1, 6, 8, 6, 8, 6] },
  { id: 'E7',  name: 'E7',  root: 'E',   frets: [0, 2, 0, 1, 0, 0] },
  { id: 'F7',  name: 'F7',  root: 'F',   frets: [1, 3, 1, 2, 1, 1] },
  { id: 'F#7', name: 'F#7', root: 'F#',  frets: [2, 4, 2, 3, 2, 2] },
  { id: 'G7',  name: 'G7',  root: 'G',   frets: [3, 2, 0, 0, 0, 1] },
  { id: 'G#7', name: 'G#7', root: 'G#',  frets: [4, 6, 4, 5, 4, 4] },
  { id: 'A7',  name: 'A7',  root: 'A',   frets: [-1, 0, 2, 0, 2, 0] },
  { id: 'A#7', name: 'A#7', root: 'A#',  frets: [-1, 1, 3, 1, 3, 1] },
  { id: 'B7',  name: 'B7',  root: 'B',   frets: [-1, 2, 1, 2, 0, 2] },

  // ── Minor 7th ──────────────────────────────────────────────────────────────
  { id: 'Cm7',  name: 'Cm7',  root: 'C',  frets: [-1, 3, 5, 3, 4, 3] },
  { id: 'C#m7', name: 'C#m7', root: 'C#', frets: [-1, 4, 6, 4, 5, 4] },
  { id: 'Dm7',  name: 'Dm7',  root: 'D',  frets: [-1, -1, 0, 2, 1, 1] },
  { id: 'D#m7', name: 'D#m7', root: 'D#', frets: [-1, 6, 8, 6, 7, 6] },
  { id: 'Em7',  name: 'Em7',  root: 'E',  frets: [0, 2, 0, 0, 0, 0] },
  { id: 'Fm7',  name: 'Fm7',  root: 'F',  frets: [1, 3, 1, 1, 1, 1] },
  { id: 'F#m7', name: 'F#m7', root: 'F#', frets: [2, 4, 2, 2, 2, 2] },
  { id: 'Gm7',  name: 'Gm7',  root: 'G',  frets: [3, 5, 3, 3, 3, 3] },
  { id: 'G#m7', name: 'G#m7', root: 'G#', frets: [4, 6, 4, 4, 4, 4] },
  { id: 'Am7',  name: 'Am7',  root: 'A',  frets: [-1, 0, 2, 0, 1, 0] },
  { id: 'A#m7', name: 'A#m7', root: 'A#', frets: [-1, 1, 3, 1, 2, 1] },
  { id: 'Bm7',  name: 'Bm7',  root: 'B',  frets: [-1, 2, 4, 2, 3, 2] },

  // ── Major 7th ──────────────────────────────────────────────────────────────
  { id: 'Cmaj7',  name: 'Cmaj7',  root: 'C',  frets: [-1, 3, 2, 0, 0, 0] },
  { id: 'C#maj7', name: 'C#maj7', root: 'C#', frets: [-1, 4, 6, 5, 6, 4] },
  { id: 'Dmaj7',  name: 'Dmaj7',  root: 'D',  frets: [-1, -1, 0, 2, 2, 2] },
  { id: 'D#maj7', name: 'D#maj7', root: 'D#', frets: [-1, 6, 8, 7, 8, 6] },
  { id: 'Emaj7',  name: 'Emaj7',  root: 'E',  frets: [0, 2, 1, 1, 0, 0] },
  { id: 'Fmaj7',  name: 'Fmaj7',  root: 'F',  frets: [-1, -1, 3, 2, 1, 0] },
  { id: 'F#maj7', name: 'F#maj7', root: 'F#', frets: [2, 4, 3, 3, 2, 2] },
  { id: 'Gmaj7',  name: 'Gmaj7',  root: 'G',  frets: [3, 2, 0, 0, 0, 2] },
  { id: 'G#maj7', name: 'G#maj7', root: 'G#', frets: [4, 6, 5, 5, 4, 4] },
  { id: 'Amaj7',  name: 'Amaj7',  root: 'A',  frets: [-1, 0, 2, 1, 2, 0] },
  { id: 'A#maj7', name: 'A#maj7', root: 'A#', frets: [-1, 1, 3, 2, 3, 1] },
  { id: 'Bmaj7',  name: 'Bmaj7',  root: 'B',  frets: [-1, 2, 4, 3, 4, 2] },

  // ── Major 9th ──────────────────────────────────────────────────────────────
  { id: 'Cmaj9',  name: 'Cmaj9',  root: 'C',  frets: [-1, 3, 2, 4, 3, 0] },
  { id: 'Dmaj9',  name: 'Dmaj9',  root: 'D',  frets: [-1, -1, 0, 2, 2, 0] },
  { id: 'Emaj9',  name: 'Emaj9',  root: 'E',  frets: [0, 2, 1, 1, 0, 2] },
  { id: 'Fmaj9',  name: 'Fmaj9',  root: 'F',  frets: [-1, 0, 3, 0, 1, 0] },
  { id: 'Gmaj9',  name: 'Gmaj9',  root: 'G',  frets: [3, -1, 0, 2, 0, 2] },
  { id: 'Amaj9',  name: 'Amaj9',  root: 'A',  frets: [-1, 0, 2, 1, 0, 0] },
  { id: 'Bmaj9',  name: 'Bmaj9',  root: 'B',  frets: [-1, 2, 1, 3, 2, 2] },
];

export type ChordCategory = 'Major' | 'Minor' | 'Dom 7' | 'Min 7' | 'Maj 7' | 'Maj 9';

const ALL_12 = (suffix: string) =>
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(n => n + suffix);

export const CHORD_CATEGORIES: { label: ChordCategory; ids: string[] }[] = [
  { label: 'Major',  ids: ALL_12('') },
  { label: 'Minor',  ids: ALL_12('m') },
  { label: 'Dom 7',  ids: ALL_12('7') },
  { label: 'Min 7',  ids: ALL_12('m7') },
  { label: 'Maj 7',  ids: ALL_12('maj7') },
  { label: 'Maj 9',  ids: ['Cmaj9', 'Dmaj9', 'Emaj9', 'Fmaj9', 'Gmaj9', 'Amaj9', 'Bmaj9'] },
];
