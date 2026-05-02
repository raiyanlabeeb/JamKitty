import type { ChordShape } from '../types';

export const CHORD_SHAPES: ChordShape[] = [
  // --- Major ---
  { id: 'C',  name: 'C',  root: 'C',  frets: [-1, 3, 2, 0, 1, 0] },
  { id: 'D',  name: 'D',  root: 'D',  frets: [-1, -1, 0, 2, 3, 2] },
  { id: 'E',  name: 'E',  root: 'E',  frets: [0, 2, 2, 1, 0, 0] },
  { id: 'F',  name: 'F',  root: 'F',  frets: [1, 3, 3, 2, 1, 1] },
  { id: 'G',  name: 'G',  root: 'G',  frets: [3, 2, 0, 0, 0, 3] },
  { id: 'A',  name: 'A',  root: 'A',  frets: [-1, 0, 2, 2, 2, 0] },
  { id: 'B',  name: 'B',  root: 'B',  frets: [-1, 2, 4, 4, 4, 2] },

  // --- Minor ---
  { id: 'Cm', name: 'Cm', root: 'C',  frets: [-1, 3, 5, 5, 4, 3] },
  { id: 'Dm', name: 'Dm', root: 'D',  frets: [-1, -1, 0, 2, 3, 1] },
  { id: 'Em', name: 'Em', root: 'E',  frets: [0, 2, 2, 0, 0, 0] },
  { id: 'Fm', name: 'Fm', root: 'F',  frets: [1, 3, 3, 1, 1, 1] },
  { id: 'Gm', name: 'Gm', root: 'G',  frets: [3, 5, 5, 3, 3, 3] },
  { id: 'Am', name: 'Am', root: 'A',  frets: [-1, 0, 2, 2, 1, 0] },
  { id: 'Bm', name: 'Bm', root: 'B',  frets: [-1, 2, 4, 4, 3, 2] },

  // --- Dominant 7th ---
  { id: 'C7', name: 'C7', root: 'C',  frets: [-1, 3, 2, 3, 1, 0] },
  { id: 'D7', name: 'D7', root: 'D',  frets: [-1, -1, 0, 2, 1, 2] },
  { id: 'E7', name: 'E7', root: 'E',  frets: [0, 2, 0, 1, 0, 0] },
  { id: 'G7', name: 'G7', root: 'G',  frets: [3, 2, 0, 0, 0, 1] },
  { id: 'A7', name: 'A7', root: 'A',  frets: [-1, 0, 2, 0, 2, 0] },
  { id: 'B7', name: 'B7', root: 'B',  frets: [-1, 2, 1, 2, 0, 2] },
];

export type ChordCategory = 'Major' | 'Minor' | 'Dom 7th';

export const CHORD_CATEGORIES: { label: ChordCategory; ids: string[] }[] = [
  { label: 'Major',   ids: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { label: 'Minor',   ids: ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'] },
  { label: 'Dom 7th', ids: ['C7', 'D7', 'E7', 'G7', 'A7', 'B7'] },
];
