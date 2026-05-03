import React, { useEffect, useRef, useState } from 'react';
import type { AppState, DiatonicChord } from '../types';
import { SCALES, INTERVAL_NAMES } from '../data/scales';
import { CHORD_SHAPES } from '../data/chords';
import { getScaleNoteNames, getChordNoteNames } from '../utils/musicTheory';
import { NOTE_INDEX } from '../data/notes';
import { playScale, playChord, playDiatonicChord, stopPlayback } from '../utils/audioPlayback';

interface InfoPanelProps {
  state: AppState;
  showDegrees?: boolean;
  onToggleDegrees?: () => void;
  diatonicChords?: DiatonicChord[];
  selectedDiatonicDegree?: number | null;
  onSelectDiatonicDegree?: (degree: number | null) => void;
}

function useAudioPlay(trigger: () => number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggle() {
    if (isPlaying) {
      stopPlayback();
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      setIsPlaying(false);
    } else {
      const duration = trigger();
      setIsPlaying(true);
      timerRef.current = setTimeout(() => { setIsPlaying(false); timerRef.current = null; }, duration);
    }
  }

  useEffect(() => {
    return () => {
      stopPlayback();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isPlaying, toggle, stop: () => { stopPlayback(); setIsPlaying(false); } };
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  state,
  showDegrees = false,
  onToggleDegrees,
  diatonicChords = [],
  selectedDiatonicDegree = null,
  onSelectDiatonicDegree,
}) => {
  if (state.mode === 'scales') {
    const scale = SCALES.find(s => s.id === state.selectedScale);
    if (!scale) return null;
    const notes = getScaleNoteNames(state.selectedRoot, scale.intervals);
    const rootIdx = NOTE_INDEX[state.selectedRoot];

    return (
      <ScalePanelInner
        title={`${state.selectedRoot} ${scale.name}`}
        notes={notes}
        intervals={scale.intervals}
        rootIdx={rootIdx}
        root={state.selectedRoot}
        showDegrees={showDegrees}
        onToggleDegrees={onToggleDegrees}
        diatonicChords={diatonicChords}
        selectedDiatonicDegree={selectedDiatonicDegree}
        onSelectDiatonicDegree={onSelectDiatonicDegree}
      />
    );
  }

  const chord = CHORD_SHAPES.find(c => c.id === state.selectedChord);
  if (!chord) return null;
  const notes = getChordNoteNames(chord);
  const fretStr = chord.frets.map(f => (f === -1 ? 'x' : String(f))).join('  ');

  return (
    <ChordPanelInner
      title={chord.name}
      notes={notes}
      rootNote={chord.root}
      fretStr={fretStr}
      chordId={chord.id}
      chord={chord}
    />
  );
};

const DEGREE_NAMES: Record<string, string> = {
  R: '1', b2: '♭2', '2': '2', b3: '♭3', '3': '3',
  '4': '4', b5: '♭5', '5': '5', b6: '♭6', '6': '6',
  b7: '♭7', '7': '7',
};

const QUALITY_SUFFIX: Record<DiatonicChord['quality'], string> = {
  major: '',
  minor: 'm',
  diminished: '°',
  augmented: '+',
};

interface ScalePanelProps {
  title: string;
  notes: string[];
  intervals: number[];
  rootIdx: number;
  root: import('../types').NoteName;
  showDegrees: boolean;
  onToggleDegrees?: () => void;
  diatonicChords: DiatonicChord[];
  selectedDiatonicDegree: number | null;
  onSelectDiatonicDegree?: (degree: number | null) => void;
}

function ScalePanelInner({
  title, notes, intervals, rootIdx, root,
  showDegrees, onToggleDegrees,
  diatonicChords, selectedDiatonicDegree, onSelectDiatonicDegree,
}: ScalePanelProps) {
  const { isPlaying, toggle, stop } = useAudioPlay(() => playScale(root, intervals));

  useEffect(() => { stop(); }, [root, intervals.join(',')]);

  function handleChordClick(chord: DiatonicChord) {
    stopPlayback();
    const next = chord.degree === selectedDiatonicDegree ? null : chord.degree;
    onSelectDiatonicDegree?.(next);
    if (next !== null) playDiatonicChord(chord.root, chord.quality);
  }

  return (
    <div className="info-panel">
      <div className="info-header">
        <h2 className="info-title">{title}</h2>
        <div className="info-header-actions">
          <button
            className={`degree-toggle ${showDegrees ? 'active' : ''}`}
            onClick={onToggleDegrees}
            title="Toggle scale degrees / note names"
          >
            {showDegrees ? '123' : 'ABC'}
          </button>
          <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={toggle} title={isPlaying ? 'Stop' : 'Play scale'}>
            {isPlaying ? '■' : '▶'}
          </button>
        </div>
      </div>

      <div className="info-notes">
        {notes.map((note, i) => {
          const isRoot = (NOTE_INDEX[note as import('../types').NoteName] - rootIdx + 12) % 12 === 0;
          const intervalLabel = INTERVAL_NAMES[intervals[i]];
          const degree = DEGREE_NAMES[intervalLabel] ?? intervalLabel;
          return (
            <div key={i} className={`info-note ${isRoot ? 'info-note-root' : ''}`}>
              <span className="info-note-name">{showDegrees ? degree : note}</span>
              <span className="info-interval">{showDegrees ? note : intervalLabel}</span>
            </div>
          );
        })}
      </div>

      {diatonicChords.length > 0 && (
        <div className="diatonic-section">
          <span className="diatonic-label">Diatonic Chords</span>
          <div className="diatonic-chords">
            {diatonicChords.map(chord => {
              const isActive = chord.degree === selectedDiatonicDegree;
              return (
                <button
                  key={chord.degree}
                  className={`diatonic-btn diatonic-${chord.quality} ${isActive ? 'active' : ''}`}
                  onClick={() => handleChordClick(chord)}
                  title={`${chord.root}${QUALITY_SUFFIX[chord.quality]}`}
                >
                  <span className="diatonic-roman">{chord.roman}</span>
                  <span className="diatonic-name">{chord.root}{QUALITY_SUFFIX[chord.quality]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ChordPanelProps {
  title: string;
  notes: string[];
  rootNote: import('../types').NoteName;
  fretStr: string;
  chordId: string;
  chord: import('../types').ChordShape;
}

function ChordPanelInner({ title, notes, rootNote, fretStr, chordId, chord }: ChordPanelProps) {
  const { isPlaying, toggle, stop } = useAudioPlay(() => playChord(chord));

  useEffect(() => { stop(); }, [chordId]);

  return (
    <div className="info-panel">
      <div className="info-header">
        <h2 className="info-title">{title}</h2>
        <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={toggle} title={isPlaying ? 'Stop' : 'Play chord'}>
          {isPlaying ? '■' : '▶'}
        </button>
      </div>
      <div className="info-notes">
        {notes.map((note, i) => {
          const isRoot = note === rootNote;
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
    </div>
  );
}

export default InfoPanel;
