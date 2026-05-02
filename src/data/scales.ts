import type { ScaleDefinition } from '../types';

export const SCALES: ScaleDefinition[] = [
  { id: 'major',          name: 'Major (Ionian)',       intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'naturalMinor',   name: 'Natural Minor',        intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'pentatonicMaj',  name: 'Pentatonic Major',     intervals: [0, 2, 4, 7, 9] },
  { id: 'pentatonicMin',  name: 'Pentatonic Minor',     intervals: [0, 3, 5, 7, 10] },
  { id: 'blues',          name: 'Blues',                intervals: [0, 3, 5, 6, 7, 10] },
  { id: 'dorian',         name: 'Dorian',               intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'phrygian',       name: 'Phrygian',             intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: 'lydian',         name: 'Lydian',               intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: 'mixolydian',     name: 'Mixolydian',           intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: 'harmonicMinor', name: 'Harmonic Minor',        intervals: [0, 2, 3, 5, 7, 8, 11] },
];

export const INTERVAL_NAMES: Record<number, string> = {
  0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3',
  5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6',
  10: 'b7', 11: '7',
};
