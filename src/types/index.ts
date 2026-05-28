export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface FretNote {
  string: number;   // 0 = low E, 5 = high E
  fret: number;     // 0 = open, 1-14 = fret position
  note: NoteName;
  isRoot: boolean;
  intervalName?: string;
}

export interface ScaleDefinition {
  id: string;
  name: string;
  intervals: number[];
}

export interface ChordShape {
  id: string;
  name: string;
  root: NoteName;
  frets: number[]; // [low E, A, D, G, B, high E] — -1 = muted, 0 = open
}

export interface DiatonicChord {
  degree: number;
  roman: string;
  root: NoteName;
  quality: 'major' | 'minor' | 'diminished' | 'augmented';
  notes: [NoteName, NoteName, NoteName];
}

export type MenuMode = 'scales' | 'chords' | 'exercise' | 'progression';

export interface AppState {
  mode: MenuMode;
  selectedRoot: NoteName;
  selectedScale: string;
  selectedChord: string;
  selectedPosition: number | null;      // scales: null = full neck, number = starting fret
  selectedChordPosition: number | null; // chords: null = full neck, number = starting fret
}
