import { useMemo, useState } from 'react';
import type { AppState } from './types';
import { SCALES } from './data/scales';
import { CHORD_SHAPES } from './data/chords';
import {
  getFretboardScaleNotes,
  getFretboardChordNotes,
  getMutedStrings,
} from './utils/musicTheory';
import Fretboard from './components/Fretboard';
import Menu from './components/Menu';
import InfoPanel from './components/InfoPanel';
import Exercise from './components/Exercise';
import './App.css';

const DEFAULT_STATE: AppState = {
  mode: 'scales',
  selectedRoot: 'C',
  selectedScale: 'major',
  selectedChord: 'Am',
};

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  const highlightedNotes = useMemo(() => {
    if (state.mode === 'scales') {
      const scale = SCALES.find(s => s.id === state.selectedScale);
      return scale ? getFretboardScaleNotes(state.selectedRoot, scale.intervals) : [];
    }
    if (state.mode === 'chords') {
      const chord = CHORD_SHAPES.find(c => c.id === state.selectedChord);
      return chord ? getFretboardChordNotes(chord) : [];
    }
    return [];
  }, [state.mode, state.selectedRoot, state.selectedScale, state.selectedChord]);

  const mutedStrings = useMemo(() => {
    if (state.mode !== 'chords') return new Set<number>();
    const chord = CHORD_SHAPES.find(c => c.id === state.selectedChord);
    return chord ? getMutedStrings(chord) : new Set<number>();
  }, [state.mode, state.selectedChord]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-logo">🐱</span>
          <span className="header-title">JamKitty</span>
        </div>
        <span className="header-sub">Guitar Theory Visualizer</span>
      </header>

      <aside className="app-sidebar">
        <Menu state={state} onChange={setState} />
      </aside>

      <main className="app-main">
        {state.mode === 'exercise' ? (
          <Exercise />
        ) : (
          <>
            <Fretboard
              highlightedNotes={highlightedNotes}
              mutedStrings={mutedStrings}
              showIntervals={state.mode === 'scales'}
            />
            <InfoPanel state={state} />
          </>
        )}
      </main>
    </div>
  );
}
