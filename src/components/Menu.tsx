import React from 'react';
import type { AppState, NoteName } from '../types';
import { CHROMATIC_NOTES } from '../data/notes';
import { SCALES } from '../data/scales';
import { CHORD_SHAPES, CHORD_CATEGORIES } from '../data/chords';

interface MenuProps {
  state: AppState;
  onChange: (next: AppState) => void;
}

const Menu: React.FC<MenuProps> = ({ state, onChange }) => {
  const set = (partial: Partial<AppState>) => onChange({ ...state, ...partial });

  return (
    <nav className="menu">
      {/* Mode toggle */}
      <div className="menu-section">
        <div className="mode-toggle">
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
        </>
      )}

      {state.mode === 'chords' && (
        <div className="menu-section">
          {CHORD_CATEGORIES.map(cat => (
            <div key={cat.label}>
              <h3 className="section-label">{cat.label}</h3>
              <div className="chord-grid">
                {cat.ids.map(id => {
                  const chord = CHORD_SHAPES.find(c => c.id === id);
                  if (!chord) return null;
                  return (
                    <button
                      key={id}
                      className={state.selectedChord === id ? 'chord-btn active' : 'chord-btn'}
                      onClick={() => set({ selectedChord: id })}
                    >
                      {chord.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Menu;
