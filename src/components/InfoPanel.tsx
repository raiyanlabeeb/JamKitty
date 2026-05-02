import React from 'react';
import type { AppState } from '../types';
import { SCALES, INTERVAL_NAMES } from '../data/scales';
import { CHORD_SHAPES } from '../data/chords';
import { getScaleNoteNames, getChordNoteNames } from '../utils/musicTheory';
import { NOTE_INDEX } from '../data/notes';

interface InfoPanelProps {
  state: AppState;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ state }) => {
  if (state.mode === 'scales') {
    const scale = SCALES.find(s => s.id === state.selectedScale);
    if (!scale) return null;
    const notes = getScaleNoteNames(state.selectedRoot, scale.intervals);
    const rootIdx = NOTE_INDEX[state.selectedRoot];

    return (
      <div className="info-panel">
        <h2 className="info-title">
          {state.selectedRoot} {scale.name}
        </h2>
        <div className="info-notes">
          {notes.map((note, i) => {
            const isRoot = (NOTE_INDEX[note] - rootIdx + 12) % 12 === 0;
            return (
              <div key={i} className={`info-note ${isRoot ? 'info-note-root' : ''}`}>
                <span className="info-note-name">{note}</span>
                <span className="info-interval">{INTERVAL_NAMES[scale.intervals[i]]}</span>
              </div>
            );
          })}
        </div>
        <p className="info-hint">Orange = root &nbsp;|&nbsp; Teal = scale tone</p>
      </div>
    );
  }

  const chord = CHORD_SHAPES.find(c => c.id === state.selectedChord);
  if (!chord) return null;
  const notes = getChordNoteNames(chord);
  const fretStr = chord.frets.map(f => (f === -1 ? 'x' : String(f))).join('  ');

  return (
    <div className="info-panel">
      <h2 className="info-title">{chord.name}</h2>
      <div className="info-notes">
        {notes.map((note, i) => {
          const isRoot = note === chord.root;
          return (
            <div key={i} className={`info-note ${isRoot ? 'info-note-root' : ''}`}>
              <span className="info-note-name">{note}</span>
            </div>
          );
        })}
      </div>
      <div className="info-frets">
        <span className="info-fret-label">Frets:</span>
        <span className="info-fret-values">{fretStr}</span>
      </div>
      <p className="info-hint">Orange = root &nbsp;|&nbsp; Teal = chord tone</p>
    </div>
  );
};

export default InfoPanel;
