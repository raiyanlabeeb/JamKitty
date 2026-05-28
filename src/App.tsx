import { useMemo, useState } from 'react';
import type { AppState } from './types';
import { SCALES } from './data/scales';
import { CHORD_SHAPES } from './data/chords';
import {
  getFretboardScaleNotes,
  getDiatonicChords,
  getChordQualityIntervals,
  getIntervalsForChordId,
} from './utils/musicTheory';
import Fretboard from './components/Fretboard';
import Menu from './components/Menu';
import InfoPanel from './components/InfoPanel';
import Exercise from './components/Exercise';
import ProgressionBuilder from './components/ProgressionBuilder';
import './App.css';

const DEFAULT_STATE: AppState = {
  mode: 'scales',
  selectedRoot: 'C',
  selectedScale: 'major',
  selectedChord: 'Am',
  selectedPosition: null,
  selectedChordPosition: null,
};

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [showDegrees, setShowDegrees] = useState(false);
  const [selectedDiatonicDegree, setSelectedDiatonicDegree] = useState<number | null>(null);

  function handleStateChange(next: AppState) {
    if (next.mode !== 'scales') setShowDegrees(false);
    if (next.selectedRoot !== state.selectedRoot || next.selectedScale !== state.selectedScale) {
      setSelectedDiatonicDegree(null);
    }
    setState(next);
  }

  const diatonicChords = useMemo(() => {
    if (state.mode !== 'scales') return [];
    const scale = SCALES.find(s => s.id === state.selectedScale);
    return scale ? getDiatonicChords(state.selectedRoot, scale.intervals) : [];
  }, [state.mode, state.selectedRoot, state.selectedScale]);

  const highlightedNotes = useMemo(() => {
    if (state.mode === 'scales') {
      const scale = SCALES.find(s => s.id === state.selectedScale);
      if (!scale) return [];

      if (selectedDiatonicDegree !== null && diatonicChords[selectedDiatonicDegree]) {
        const chord = diatonicChords[selectedDiatonicDegree];
        return getFretboardScaleNotes(chord.root, getChordQualityIntervals(chord.quality), state.selectedPosition);
      }

      return getFretboardScaleNotes(state.selectedRoot, scale.intervals, state.selectedPosition);
    }
    if (state.mode === 'chords') {
      const chord = CHORD_SHAPES.find(c => c.id === state.selectedChord);
      if (!chord) return [];
      return getFretboardScaleNotes(chord.root, getIntervalsForChordId(state.selectedChord), state.selectedChordPosition);
    }
    return [];
  }, [state, selectedDiatonicDegree, diatonicChords]);

  const mutedStrings = useMemo(() => new Set<number>(), []);

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
        <Menu state={state} onChange={handleStateChange} />
      </aside>

      <main className="app-main">
        {state.mode === 'exercise' ? (
          <Exercise />
        ) : state.mode === 'progression' ? (
          <ProgressionBuilder />
        ) : (
          <>
            <Fretboard
              highlightedNotes={highlightedNotes}
              mutedStrings={mutedStrings}
              showIntervals={state.mode === 'scales'}
              showDegrees={showDegrees}
            />
            <InfoPanel
              state={state}
              showDegrees={showDegrees}
              onToggleDegrees={() => setShowDegrees(d => !d)}
              diatonicChords={diatonicChords}
              selectedDiatonicDegree={selectedDiatonicDegree}
              onSelectDiatonicDegree={setSelectedDiatonicDegree}
            />
          </>
        )}
      </main>
    </div>
  );
}
