import React from 'react';
import type { AppState, NoteName } from '../types';
import { CHROMATIC_NOTES } from '../data/notes';
import { SCALES } from '../data/scales';
import { CHORD_SHAPES } from '../data/chords';

const CHORD_QUALITIES = [
  { label: 'Major', suffix: '' },
  { label: 'Minor', suffix: 'm' },
  { label: 'Dom 7', suffix: '7' },
  { label: 'Min 7', suffix: 'm7' },
  { label: 'Maj 7', suffix: 'maj7' },
  { label: 'Maj 9', suffix: 'maj9' },
];

function chordRoot(id: string): string {
  for (const q of [...CHORD_QUALITIES].sort((a, b) => b.suffix.length - a.suffix.length)) {
    if (q.suffix && id.endsWith(q.suffix)) return id.slice(0, -q.suffix.length);
  }
  return id;
}

function chordSuffix(id: string): string {
  for (const q of [...CHORD_QUALITIES].sort((a, b) => b.suffix.length - a.suffix.length)) {
    if (q.suffix && id.endsWith(q.suffix)) return q.suffix;
  }
  return '';
}

interface MenuProps {
  state: AppState;
  onChange: (next: AppState) => void;
}

const POSITIONS: { label: string; fret: number | null }[] = [
  { label: 'Full', fret: null },
  { label: 'Open', fret: 0 },
  { label: 'III', fret: 3 },
  { label: 'V', fret: 5 },
  { label: 'VII', fret: 7 },
  { label: 'IX', fret: 9 },
  { label: 'XII', fret: 12 },
];

const Menu: React.FC<MenuProps> = ({ state, onChange }) => {
  const set = (partial: Partial<AppState>) => onChange({ ...state, ...partial });

  return (
    <nav className="menu">
      {/* Mode toggle */}
      <div className="menu-section">
        <div className="mode-toggle mode-toggle-4">
          <button
            className={state.mode === 'scales' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => set({ mode: 'scales' })}
          >
            Scales
          </button>
          <button
            className={state.mode === 'chords' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => set({ mode: 'chords' })}
          >
            Chords
          </button>
          <button
            className={state.mode === 'progression' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => set({ mode: 'progression' })}
          >
            🎵 Groove
          </button>
          <button
            className={state.mode === 'exercise' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => set({ mode: 'exercise' })}
          >
            🎯 Quiz
          </button>
        </div>
      </div>

      {state.mode === 'scales' && (
        <>
          <div className="menu-section">
            <h3 className="section-label">Root Note</h3>
            <div className="note-grid">
              {CHROMATIC_NOTES.map(note => (
                <button
                  key={note}
                  className={state.selectedRoot === note ? 'note-btn active' : 'note-btn'}
                  onClick={() => set({ selectedRoot: note as NoteName })}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <h3 className="section-label">Scale</h3>
            <div className="scale-list">
              {SCALES.map(scale => (
                <button
                  key={scale.id}
                  className={state.selectedScale === scale.id ? 'scale-btn active' : 'scale-btn'}
                  onClick={() => set({ selectedScale: scale.id })}
                >
                  {scale.name}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <h3 className="section-label">Position</h3>
            <div className="position-grid">
              {POSITIONS.map(({ label, fret }) => (
                <button
                  key={label}
                  className={state.selectedPosition === fret ? 'pos-btn active' : 'pos-btn'}
                  onClick={() => set({ selectedPosition: fret })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {state.mode === 'chords' && (
        <>
          <div className="menu-section">
            <h3 className="section-label">Root Note</h3>
            <div className="note-grid">
              {CHROMATIC_NOTES.map(note => {
                const newId = note + chordSuffix(state.selectedChord);
                const targetId = CHORD_SHAPES.some(c => c.id === newId) ? newId : note;
                return (
                  <button
                    key={note}
                    className={`note-btn ${chordRoot(state.selectedChord) === note ? 'active' : ''}`}
                    onClick={() => set({ selectedChord: targetId })}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="menu-section">
            <h3 className="section-label">Quality</h3>
            <div className="chord-quality-grid">
              {CHORD_QUALITIES.map(q => {
                const newId = chordRoot(state.selectedChord) + q.suffix;
                const available = CHORD_SHAPES.some(c => c.id === newId);
                return (
                  <button
                    key={q.label}
                    className={`quality-btn ${chordSuffix(state.selectedChord) === q.suffix ? 'active' : ''}`}
                    disabled={!available}
                    onClick={() => set({ selectedChord: newId })}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="menu-section">
            <h3 className="section-label">Position</h3>
            <div className="position-grid">
              {POSITIONS.map(({ label, fret }) => (
                <button
                  key={label}
                  className={state.selectedChordPosition === fret ? 'pos-btn active' : 'pos-btn'}
                  onClick={() => set({ selectedChordPosition: fret })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Menu;
