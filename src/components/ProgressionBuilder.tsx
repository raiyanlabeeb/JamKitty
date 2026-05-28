import { useEffect, useRef, useState } from 'react';
import type { NoteName } from '../types';
import { CHROMATIC_NOTES } from '../data/notes';
import { CHORD_SHAPES } from '../data/chords';
import { getFretboardChordNotes, getMutedStrings } from '../utils/musicTheory';
import { startProgressionLoop } from '../utils/audioPlayback';
import Fretboard from './Fretboard';

type ChordQuality = 'major' | 'minor' | 'dom7' | 'min7' | 'maj7';

interface ProgressionEntry {
  root: NoteName;
  quality: ChordQuality;
}

const QUALITIES: { label: string; quality: ChordQuality; suffix: string }[] = [
  { label: 'Major', quality: 'major', suffix: '' },
  { label: 'Minor', quality: 'minor', suffix: 'm' },
  { label: '7',     quality: 'dom7',  suffix: '7' },
  { label: 'm7',    quality: 'min7',  suffix: 'm7' },
  { label: 'maj7',  quality: 'maj7',  suffix: 'maj7' },
];

const SUFFIX_MAP: Record<ChordQuality, string> = {
  major: '', minor: 'm', dom7: '7', min7: 'm7', maj7: 'maj7',
};

function entryToId(e: ProgressionEntry) {
  return e.root + SUFFIX_MAP[e.quality];
}

export default function ProgressionBuilder() {
  const [progression, setProgression] = useState<ProgressionEntry[]>([]);
  const [pickerRoot, setPickerRoot] = useState<NoteName>('C');
  const [pickerQuality, setPickerQuality] = useState<ChordQuality>('major');
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  function addChord() {
    if (progression.length >= 8) return;
    setProgression(p => [...p, { root: pickerRoot, quality: pickerQuality }]);
  }

  function removeChord(idx: number) {
    setProgression(p => p.filter((_, i) => i !== idx));
    setActiveSlot(a => {
      if (a === null || a === idx) return null;
      return a > idx ? a - 1 : a;
    });
  }

  function handlePlay() {
    if (progression.length === 0) return;
    const shapes = progression
      .map(e => CHORD_SHAPES.find(c => c.id === entryToId(e)))
      .filter(Boolean) as typeof CHORD_SHAPES;

    const stop = startProgressionLoop(shapes, bpm, idx => setActiveSlot(idx));
    stopRef.current = stop;
    setIsPlaying(true);
  }

  function handleStop() {
    stopRef.current?.();
    stopRef.current = null;
    setIsPlaying(false);
    setActiveSlot(null);
  }

  useEffect(() => () => { stopRef.current?.(); }, []);

  const displayEntry = activeSlot !== null ? progression[activeSlot] : null;
  const displayChord = displayEntry
    ? CHORD_SHAPES.find(c => c.id === entryToId(displayEntry))
    : null;

  const highlightedNotes = displayChord ? getFretboardChordNotes(displayChord) : [];
  const mutedStrings = displayChord ? getMutedStrings(displayChord) : new Set<number>();

  const previewName = pickerRoot + (SUFFIX_MAP[pickerQuality] || '');

  return (
    <div className="progression-layout">
      <div className="progression-card">

        <div className="prog-section">
          <h3 className="section-label">Root Note</h3>
          <div className="note-grid">
            {CHROMATIC_NOTES.map(note => (
              <button
                key={note}
                className={`note-btn ${pickerRoot === note ? 'active' : ''}`}
                onClick={() => setPickerRoot(note as NoteName)}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        <div className="prog-section">
          <h3 className="section-label">Quality</h3>
          <div className="quality-grid">
            {QUALITIES.map(q => (
              <button
                key={q.quality}
                className={`quality-btn ${pickerQuality === q.quality ? 'active' : ''}`}
                onClick={() => setPickerQuality(q.quality)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="add-chord-btn"
          onClick={addChord}
          disabled={progression.length >= 8}
        >
          + Add {previewName}
        </button>

        <div className="prog-section">
          <div className="prog-header">
            <h3 className="section-label">
              Progression {progression.length > 0 && `(${progression.length}/8)`}
            </h3>
            {progression.length > 0 && !isPlaying && (
              <button className="clear-btn" onClick={() => { setProgression([]); setActiveSlot(null); }}>
                Clear
              </button>
            )}
          </div>

          {progression.length === 0 ? (
            <p className="prog-empty">Add chords above to build your progression</p>
          ) : (
            <div className="prog-slots">
              {progression.map((entry, i) => (
                <div
                  key={i}
                  className={`prog-slot ${activeSlot === i ? 'active' : ''}`}
                  onClick={() => !isPlaying && setActiveSlot(i === activeSlot ? null : i)}
                >
                  <span className="prog-slot-name">{entryToId(entry)}</span>
                  {!isPlaying && (
                    <button
                      className="prog-slot-remove"
                      onClick={e => { e.stopPropagation(); removeChord(i); }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="prog-controls">
          <div className="bpm-control">
            <span className="bpm-label">BPM: <strong>{bpm}</strong></span>
            <input
              type="range"
              min={40}
              max={180}
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="bpm-slider"
              disabled={isPlaying}
            />
          </div>
          <button
            className={`play-stop-btn ${isPlaying ? 'playing' : ''}`}
            onClick={isPlaying ? handleStop : handlePlay}
            disabled={progression.length === 0}
          >
            {isPlaying ? '⏹ Stop' : '▶ Play'}
          </button>
        </div>

      </div>

      <Fretboard
        highlightedNotes={highlightedNotes}
        mutedStrings={mutedStrings}
        showIntervals={false}
      />
    </div>
  );
}
