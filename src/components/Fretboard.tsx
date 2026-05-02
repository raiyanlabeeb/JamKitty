import React from 'react';
import type { FretNote } from '../types';
import { STRING_LABELS } from '../data/notes';

interface FretboardProps {
  highlightedNotes: FretNote[];
  mutedStrings: Set<number>;
  showIntervals: boolean;
}

// Layout constants
const NUM_STRINGS = 6;
const NUM_FRETS = 15;       // fret lines 0–15 (shows frets 1–14)
const PADDING_TOP = 32;
const PADDING_LEFT = 36;
const FRET_SPACING = 60;
const STRING_SPACING = 32;
const NUT_X = PADDING_LEFT + 18;
const NOTE_R = 12;

const SVG_W = NUT_X + NUM_FRETS * FRET_SPACING + 20;
const SVG_H = PADDING_TOP + (NUM_STRINGS - 1) * STRING_SPACING + 28;

const stringY = (s: number) => PADDING_TOP + (NUM_STRINGS - 1 - s) * STRING_SPACING;
const fretLineX = (f: number) => NUT_X + f * FRET_SPACING;
const noteX = (fret: number) =>
  fret === 0 ? NUT_X - NOTE_R - 8 : NUT_X + (fret - 0.5) * FRET_SPACING;

const STRING_STROKE = [2.4, 2.0, 1.7, 1.4, 1.1, 0.9]; // low E → high E

const SINGLE_MARKERS = [3, 5, 7, 9];
const DOUBLE_MARKERS = [12];

const Fretboard: React.FC<FretboardProps> = ({ highlightedNotes, mutedStrings, showIntervals }) => {
  const midY = PADDING_TOP + 2.5 * STRING_SPACING;

  return (
    <div className="fretboard-wrapper">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="fretboard-svg"
        aria-label="Guitar fretboard"
      >
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a1f08" />
            <stop offset="50%"  stopColor="#2a1405" />
            <stop offset="100%" stopColor="#3a1f08" />
          </linearGradient>
          <radialGradient id="rootGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#ff8c55" />
            <stop offset="100%" stopColor="#e85d24" />
          </radialGradient>
          <radialGradient id="toneGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#6ee8e0" />
            <stop offset="100%" stopColor="#2ab8b0" />
          </radialGradient>
        </defs>

        {/* Fretboard body */}
        <rect
          x={NUT_X}
          y={PADDING_TOP - 14}
          width={NUM_FRETS * FRET_SPACING}
          height={(NUM_STRINGS - 1) * STRING_SPACING + 28}
          fill="url(#wood)"
          rx={3}
        />

        {/* Position markers */}
        {SINGLE_MARKERS.map(f => (
          <circle key={f} cx={fretLineX(f) - FRET_SPACING / 2} cy={midY} r={5} fill="#5a3a1a" />
        ))}
        {DOUBLE_MARKERS.map(f => (
          <React.Fragment key={f}>
            <circle cx={fretLineX(f) - FRET_SPACING / 2} cy={midY - STRING_SPACING} r={5} fill="#5a3a1a" />
            <circle cx={fretLineX(f) - FRET_SPACING / 2} cy={midY + STRING_SPACING} r={5} fill="#5a3a1a" />
          </React.Fragment>
        ))}

        {/* Fret lines */}
        {Array.from({ length: NUM_FRETS + 1 }, (_, f) => (
          <line
            key={f}
            x1={fretLineX(f)} y1={PADDING_TOP - 14}
            x2={fretLineX(f)} y2={PADDING_TOP + (NUM_STRINGS - 1) * STRING_SPACING + 14}
            stroke={f === 0 ? '#f0e6d3' : '#6e6660'}
            strokeWidth={f === 0 ? 5 : 1.5}
          />
        ))}

        {/* Fret numbers */}
        {[1, 3, 5, 7, 9, 12, 15].filter(f => f <= NUM_FRETS).map(f => (
          <text
            key={f}
            x={fretLineX(f) - FRET_SPACING / 2}
            y={14}
            textAnchor="middle"
            fill="#6b7a99"
            fontSize={11}
            fontFamily="monospace"
          >
            {f}
          </text>
        ))}

        {/* Strings */}
        {Array.from({ length: NUM_STRINGS }, (_, s) => (
          <line
            key={s}
            x1={NUT_X} y1={stringY(s)}
            x2={NUT_X + NUM_FRETS * FRET_SPACING} y2={stringY(s)}
            stroke="#c8a83a"
            strokeWidth={STRING_STROKE[s]}
            opacity={0.8}
          />
        ))}

        {/* String labels */}
        {Array.from({ length: NUM_STRINGS }, (_, s) => (
          <text
            key={s}
            x={PADDING_LEFT - 4}
            y={stringY(s) + 4}
            textAnchor="end"
            fill="#6b7a99"
            fontSize={12}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {STRING_LABELS[s]}
          </text>
        ))}

        {/* Muted string markers */}
        {Array.from(mutedStrings).map(s => {
          const y = stringY(s);
          const x = NUT_X - NOTE_R - 8;
          return (
            <g key={s}>
              <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="#e94560" strokeWidth={2} strokeLinecap="round" />
              <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="#e94560" strokeWidth={2} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Highlighted notes */}
        {highlightedNotes.map((note, i) => {
          const cx = noteX(note.fret);
          const cy = stringY(note.string);
          const gradId = note.isRoot ? 'url(#rootGrad)' : 'url(#toneGrad)';
          const label = showIntervals ? (note.intervalName ?? note.note) : note.note;

          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={NOTE_R} fill={gradId} />
              <text
                x={cx} y={cy + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize={9}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="fretboard-legend">
        <span className="legend-item legend-root">Root</span>
        <span className="legend-item legend-tone">Tone</span>
      </div>
    </div>
  );
};

export default Fretboard;
