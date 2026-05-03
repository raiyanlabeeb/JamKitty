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

  // --- Major 7th ---
  // Cmaj7: x-3-2-0-0-0  → C E G B
  { id: 'Cmaj7', name: 'Cmaj7', root: 'C', frets: [-1, 3, 2, 0, 0, 0] },
  // Dmaj7: x-x-0-2-2-2  → D A C# F#
  { id: 'Dmaj7', name: 'Dmaj7', root: 'D', frets: [-1, -1, 0, 2, 2, 2] },
  // Emaj7: 0-2-1-1-0-0  → E B D# G#
  { id: 'Emaj7', name: 'Emaj7', root: 'E', frets: [0, 2, 1, 1, 0, 0] },
  // Fmaj7: x-x-3-2-1-0  → F A C E
  { id: 'Fmaj7', name: 'Fmaj7', root: 'F', frets: [-1, -1, 3, 2, 1, 0] },
  // Gmaj7: 3-2-0-0-0-2  → G B D G B F#
  { id: 'Gmaj7', name: 'Gmaj7', root: 'G', frets: [3, 2, 0, 0, 0, 2] },
  // Amaj7: x-0-2-1-2-0  → A E G# C# E
  { id: 'Amaj7', name: 'Amaj7', root: 'A', frets: [-1, 0, 2, 1, 2, 0] },
  // Bmaj7: x-2-4-3-4-2  → B F# A# D# F#
  { id: 'Bmaj7', name: 'Bmaj7', root: 'B', frets: [-1, 2, 4, 3, 4, 2] },

  // --- Major 9th ---
  // Cmaj9:  x-3-2-4-3-0  → C E B D (no 5th)
  { id: 'Cmaj9', name: 'Cmaj9', root: 'C', frets: [-1, 3, 2, 4, 3, 0] },
  // Dmaj9:  x-x-0-2-2-0  → D A C# E (no 3rd)
  { id: 'Dmaj9', name: 'Dmaj9', root: 'D', frets: [-1, -1, 0, 2, 2, 0] },
  // Emaj9:  0-2-1-1-0-2  → E B D# G# B F#
  { id: 'Emaj9', name: 'Emaj9', root: 'E', frets: [0, 2, 1, 1, 0, 2] },
  // Fmaj9:  x-0-3-0-1-0  → A F G C E (all 5 tones)
  { id: 'Fmaj9', name: 'Fmaj9', root: 'F', frets: [-1, 0, 3, 0, 1, 0] },
  // Gmaj9:  3-x-0-2-0-2  → G D A B F# (all 5 tones, mute A string)
  { id: 'Gmaj9', name: 'Gmaj9', root: 'G', frets: [3, -1, 0, 2, 0, 2] },
  // Amaj9:  x-0-2-1-0-0  → A E G# B E (no 3rd)
  { id: 'Amaj9', name: 'Amaj9', root: 'A', frets: [-1, 0, 2, 1, 0, 0] },
  // Bmaj9:  x-2-1-3-2-2  → B D# A# C# F# (all 5 tones)
  { id: 'Bmaj9', name: 'Bmaj9', root: 'B', frets: [-1, 2, 1, 3, 2, 2] },
];

export type ChordCategory = 'Major' | 'Minor' | 'Dom 7th' | 'Major 7' | 'Major 9';

export const CHORD_CATEGORIES: { label: ChordCategory; ids: string[] }[] = [
  { label: 'Major',   ids: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { label: 'Minor',   ids: ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'] },
  { label: 'Dom 7th', ids: ['C7', 'D7', 'E7', 'G7', 'A7', 'B7'] },
  { label: 'Major 7', ids: ['Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7'] },
  { label: 'Major 9', ids: ['Cmaj9', 'Dmaj9', 'Emaj9', 'Fmaj9', 'Gmaj9', 'Amaj9', 'Bmaj9'] },
];
