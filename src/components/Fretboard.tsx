import React from 'react';
import type { FretNote } from '../types';
import { STRING_LABELS, STANDARD_TUNING, getNoteAtFret } from '../data/notes';

interface ClickFeedback {
  stringIdx: number;
  fret: number;
  correct: boolean;
}

interface FretboardProps {
  highlightedNotes: FretNote[];
  mutedStrings: Set<number>;
  showIntervals: boolean;
  // Exercise mode
  onFretClick?: (stringIdx: number, fret: number) => void;
  clickFeedback?: ClickFeedback | null;
  highlightString?: number;
  maxClickFret?: number;
}

const NUM_STRINGS = 6;
const NUM_FRETS = 15;
const PADDING_TOP = 32;
const PADDING_LEFT = 36;
const FRET_SPACING = 60;
const STRING_SPACING = 32;
const NUT_X = PADDING_LEFT + 18;
const NOTE_R = 13;
const OPEN_X = NUT_X - NOTE_R - 10;

const SVG_W = NUT_X + NUM_FRETS * FRET_SPACING + 20;
const SVG_H = PADDING_TOP + (NUM_STRINGS - 1) * STRING_SPACING + 28;

const stringY = (s: number) => PADDING_TOP + (NUM_STRINGS - 1 - s) * STRING_SPACING;
const fretLineX = (f: number) => NUT_X + f * FRET_SPACING;
const noteX = (fret: number) =>
  fret === 0 ? OPEN_X : NUT_X + (fret - 0.5) * FRET_SPACING;

const STRING_STROKE = [2.6, 2.1, 1.8, 1.4, 1.1, 0.9];
const SINGLE_MARKERS = [3, 5, 7, 9];
const DOUBLE_MARKERS = [12];

const Fretboard: React.FC<FretboardProps> = ({
  highlightedNotes,
  mutedStrings,
  showIntervals,
  onFretClick,
  clickFeedback,
  highlightString,
  maxClickFret = NUM_FRETS - 1,
}) => {
  const midY = PADDING_TOP + 2.5 * STRING_SPACING;
  const interactive = !!onFretClick;

  const openHighlightedStrings = new Set(
    highlightedNotes.filter(n => n.fret === 0).map(n => n.string)
  );

  return (
    <div className="fretboard-wrapper">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="fretboard-svg"
        aria-label="Guitar fretboard"
      >
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#c8955a" />
            <stop offset="45%"  stopColor="#a87040" />
            <stop offset="100%" stopColor="#c8955a" />
          </linearGradient>
          <filter id="noteShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5"
              floodColor="#2d1a2e" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Fretboard body */}
        <rect
          x={NUT_X} y={PADDING_TOP - 14}
          width={NUM_FRETS * FRET_SPACING}
          height={(NUM_STRINGS - 1) * STRING_SPACING + 28}
          fill="url(#wood)" rx={4}
          stroke="#2d1a2e" strokeWidth={1.5}
        />

        {/* Target-string row highlight (exercise mode) */}
        {highlightString !== undefined && (
          <rect
            x={NUT_X - 4}
            y={stringY(highlightString) - STRING_SPACING / 2}
            width={NUM_FRETS * FRET_SPACING + 8}
            height={STRING_SPACING}
            fill="rgba(253,245,191,0.28)"
            rx={3}
          />
        )}

        {/* Cream inlay dots */}
        {SINGLE_MARKERS.map(f => (
          <circle key={f}
            cx={fretLineX(f) - FRET_SPACING / 2} cy={midY} r={6}
            fill="#f0dfa8" stroke="#c8a870" strokeWidth={1} />
        ))}
        {DOUBLE_MARKERS.map(f => (
          <React.Fragment key={f}>
            <circle cx={fretLineX(f) - FRET_SPACING / 2} cy={midY - STRING_SPACING} r={6}
              fill="#f0dfa8" stroke="#c8a870" strokeWidth={1} />
            <circle cx={fretLineX(f) - FRET_SPACING / 2} cy={midY + STRING_SPACING} r={6}
              fill="#f0dfa8" stroke="#c8a870" strokeWidth={1} />
          </React.Fragment>
        ))}

        {/* Fret lines */}
        {Array.from({ length: NUM_FRETS + 1 }, (_, f) => (
          <line key={f}
            x1={fretLineX(f)} y1={PADDING_TOP - 14}
            x2={fretLineX(f)} y2={PADDING_TOP + (NUM_STRINGS - 1) * STRING_SPACING + 14}
            stroke={f === 0 ? '#f5efe0' : '#9a7858'}
            strokeWidth={f === 0 ? 6 : 1.5}
            strokeLinecap="round"
          />
        ))}

        {/* Fret numbers */}
        {[1, 3, 5, 7, 9, 12, 15].filter(f => f <= NUM_FRETS).map(f => (
          <text key={f}
            x={fretLineX(f) - FRET_SPACING / 2} y={14}
            textAnchor="middle" fill="#a888a8" fontSize={11}
            fontFamily="Nunito, system-ui, sans-serif" fontWeight="700"
          >
            {f}
          </text>
        ))}

        {/* Strings */}
        {Array.from({ length: NUM_STRINGS }, (_, s) => {
          const isTarget = highlightString === s;
          const dimmed = highlightString !== undefined && !isTarget;
          return (
            <line key={s}
              x1={NUT_X} y1={stringY(s)}
              x2={NUT_X + NUM_FRETS * FRET_SPACING} y2={stringY(s)}
              stroke={isTarget ? '#e8c040' : '#d4a830'}
              strokeWidth={isTarget ? STRING_STROKE[s] + 1 : STRING_STROKE[s]}
              opacity={dimmed ? 0.35 : 0.9}
            />
          );
        })}

        {/* String labels */}
        {Array.from({ length: NUM_STRINGS }, (_, s) =>
          openHighlightedStrings.has(s) ? null : (
            <text key={s}
              x={OPEN_X} y={stringY(s) + 5}
              textAnchor="middle" fill="#6a4870" fontSize={13}
              fontFamily="Nunito, system-ui, sans-serif" fontWeight="800"
              opacity={highlightString !== undefined && highlightString !== s ? 0.35 : 1}
            >
              {STRING_LABELS[s]}
            </text>
          )
        )}

        {/* Muted X markers */}
        {Array.from(mutedStrings).map(s => {
          const cy = stringY(s);
          return (
            <g key={s}>
              <line x1={OPEN_X - 7} y1={cy - 7} x2={OPEN_X + 7} y2={cy + 7}
                stroke="#cc4488" strokeWidth={2.5} strokeLinecap="round" />
              <line x1={OPEN_X + 7} y1={cy - 7} x2={OPEN_X - 7} y2={cy + 7}
                stroke="#cc4488" strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Clickable hit areas (exercise mode) */}
        {interactive && Array.from({ length: NUM_STRINGS }, (_, s) =>
          Array.from({ length: maxClickFret + 1 }, (_, fret) => {
            const cy = stringY(s);
            if (fret === 0) {
              return (
                <rect key={`hit-${s}-0`}
                  x={OPEN_X - NOTE_R} y={cy - NOTE_R}
                  width={NOTE_R * 2} height={NOTE_R * 2}
                  fill="transparent" style={{ cursor: 'pointer' }}
                  onClick={() => onFretClick(s, 0)}
                />
              );
            }
            return (
              <rect key={`hit-${s}-${fret}`}
                x={fretLineX(fret - 1) + 1} y={cy - STRING_SPACING / 2}
                width={FRET_SPACING - 2} height={STRING_SPACING}
                fill="transparent" style={{ cursor: 'pointer' }}
                onClick={() => onFretClick(s, fret)}
              />
            );
          })
        )}

        {/* Click feedback circle */}
        {clickFeedback && (
          <g filter="url(#noteShadow)">
            <circle
              cx={noteX(clickFeedback.fret)}
              cy={stringY(clickFeedback.stringIdx)}
              r={NOTE_R}
              fill={clickFeedback.correct ? '#7BD494' : '#FF6B6B'}
              stroke="#fff" strokeWidth={2.5}
            />
            <text
              x={noteX(clickFeedback.fret)}
              y={stringY(clickFeedback.stringIdx) + 4}
              textAnchor="middle" fill="#fff" fontSize={9} fontWeight="bold"
              fontFamily="Nunito, system-ui, sans-serif"
            >
              {getNoteAtFret(STANDARD_TUNING[clickFeedback.stringIdx], clickFeedback.fret)}
            </text>
          </g>
        )}

        {/* Highlighted notes (normal mode + correct-answer reveal) */}
        {highlightedNotes.map((note, i) => {
          const cx = noteX(note.fret);
          const cy = stringY(note.string);
          const fill   = note.isRoot ? '#B47EB3' : '#92D1C3';
          const stroke = note.isRoot ? '#7a4e80' : '#5a9888';
          const label  = showIntervals ? (note.intervalName ?? note.note) : note.note;

          return (
            <g key={`${note.string}-${note.fret}`}
              className={note.isRoot ? 'note-group-root' : 'note-group'}
              style={{ animationDelay: `${i * 18}ms` }}
              filter="url(#noteShadow)"
            >
              <circle cx={cx} cy={cy} r={NOTE_R} fill={fill} stroke="#fff" strokeWidth={2.5} />
              <circle cx={cx} cy={cy} r={NOTE_R} fill="none" stroke={stroke} strokeWidth={1} opacity={0.4} />
              <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={9}
                fontWeight="bold" fontFamily="Nunito, system-ui, sans-serif"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Fretboard;
