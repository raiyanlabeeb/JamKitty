import { useCallback, useEffect, useRef, useState } from 'react';
import type { NoteName } from '../types';
import { CHROMATIC_NOTES, STANDARD_TUNING, getNoteAtFret } from '../data/notes';
import { usePitchDetector } from '../hooks/usePitchDetector';
import Fretboard from './Fretboard';

const STRING_NAMES = ['Low E', 'A', 'D', 'G', 'B', 'High E'];
const MAX_EXERCISE_FRET = 11;

interface Question {
  stringIdx: number;
  fret: number;
  note: NoteName;
}

interface ClickFeedback {
  stringIdx: number;
  fret: number;
  correct: boolean;
}

function randomQuestion(prevNote?: NoteName): Question {
  let q: Question;
  // Avoid repeating the exact same note back to back
  do {
    const stringIdx = Math.floor(Math.random() * 6);
    const fret = Math.floor(Math.random() * (MAX_EXERCISE_FRET + 1));
    const note = getNoteAtFret(STANDARD_TUNING[stringIdx], fret);
    q = { stringIdx, fret, note };
  } while (q.note === prevNote);
  return q;
}

export default function Exercise() {
  const [question, setQuestion] = useState<Question>(() => randomQuestion());
  const [feedback, setFeedback] = useState<ClickFeedback | null>(null);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(1); // starts at 1 for the first question
  const [correct, setCorrect] = useState(0);
  const [useMic, setUseMic] = useState(false);
  const [micTriggered, setMicTriggered] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPenalisedNote = useRef<NoteName | null>(null);
  // True if the user already made a wrong attempt on the current question
  const hadWrongAttempt = useRef(false);

  const { detectedNote, micError, clearDetected } = usePitchDetector(useMic);

  const advance = useCallback((currentNote: NoteName) => {
    if (advanceTimer.current) return;
    advanceTimer.current = setTimeout(() => {
      setFeedback(null);
      setMicTriggered(false);
      lastPenalisedNote.current = null;
      hadWrongAttempt.current = false;
      clearDetected();
      setTotal(t => t + 1);
      setQuestion(randomQuestion(currentNote));
      advanceTimer.current = null;
    }, 1400);
  }, [clearDetected]);

  // Mic detection → auto-answer or streak reset on wrong note
  useEffect(() => {
    if (!useMic || micTriggered || !detectedNote) return;
    if (detectedNote === question.note) {
      setMicTriggered(true);
      lastPenalisedNote.current = null;
      setStreak(s => s + 1);
      if (!hadWrongAttempt.current) setCorrect(c => c + 1);
      setFeedback({ stringIdx: question.stringIdx, fret: question.fret, correct: true });
      advance(question.note);
    } else if (detectedNote !== lastPenalisedNote.current) {
      lastPenalisedNote.current = detectedNote;
      hadWrongAttempt.current = true;
      setStreak(0);
    }
  }, [detectedNote, useMic, micTriggered, question, advance]);

  function handleFretClick(stringIdx: number, fret: number) {
    if (advanceTimer.current) return; // waiting to advance — ignore extra clicks
    const clickedNote = getNoteAtFret(STANDARD_TUNING[stringIdx], fret);
    const isCorrect = clickedNote === question.note && stringIdx === question.stringIdx;

    setFeedback({ stringIdx, fret, correct: isCorrect });

    if (isCorrect) {
      setStreak(s => s + 1);
      if (!hadWrongAttempt.current) setCorrect(c => c + 1);
      advance(question.note);
    } else {
      hadWrongAttempt.current = true;
      setStreak(0);
      setTimeout(() => setFeedback(null), 800);
    }
  }

  function skip() {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null; }
    setFeedback(null);
    setMicTriggered(false);
    lastPenalisedNote.current = null;
    hadWrongAttempt.current = false;
    clearDetected();
    setTotal(t => t + 1);
    setQuestion(randomQuestion(question.note));
  }

  // All fret positions on the target string for correct-answer highlighting
  const correctPositions = CHROMATIC_NOTES.map((_, i) => i).filter(fret =>
    fret <= MAX_EXERCISE_FRET &&
    getNoteAtFret(STANDARD_TUNING[question.stringIdx], fret) === question.note
  );

  // Show correct positions after a correct answer
  const highlightedNotes = feedback?.correct
    ? correctPositions.map(fret => ({
        string: question.stringIdx,
        fret,
        note: question.note,
        isRoot: true,
      }))
    : [];

  return (
    <div className="exercise-layout">
      {/* Question card */}
      <div className="exercise-card">
        <div className="exercise-header">
          <span className="exercise-title">Note Challenge</span>
          <div className="exercise-stats">
            <span className="stat-streak">🔥 {streak}</span>
            <span className="stat-score">{correct}/{total}</span>
          </div>
        </div>

        <div className="exercise-prompt">
          <span className="exercise-label">Find this note on the fretboard</span>
          <div className="exercise-target">
            <span className="exercise-note">{question.note}</span>
            <span className="exercise-string-name">on the <strong>{STRING_NAMES[question.stringIdx]}</strong> string</span>
          </div>
        </div>

        <div className="exercise-actions">
          <button className="ex-btn skip-btn" onClick={skip}>Skip</button>
          <button
            className={`ex-btn mic-btn ${useMic ? 'active' : ''}`}
            onClick={() => { setUseMic(m => !m); setMicTriggered(false); }}
          >
            🎤 {useMic ? 'Mic On' : 'Use Mic'}
          </button>
        </div>

        {useMic && (
          <div className="mic-status">
            {micError
              ? <span className="mic-error">{micError}</span>
              : <span className="mic-detected">
                  Hearing: <strong>{detectedNote ?? '—'}</strong>
                  {detectedNote === question.note && !micTriggered && ' ✓'}
                </span>
            }
          </div>
        )}

        {feedback?.correct && (
          <div className="exercise-success">
            ✨ {streak > 1 ? `${streak} in a row!` : 'Correct!'}
          </div>
        )}
      </div>

      {/* Interactive fretboard */}
      <Fretboard
        highlightedNotes={highlightedNotes}
        mutedStrings={new Set()}
        showIntervals={false}
        onFretClick={handleFretClick}
        clickFeedback={feedback}
        highlightString={question.stringIdx}
        maxClickFret={MAX_EXERCISE_FRET}
      />
    </div>
  );
}
