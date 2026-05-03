import { useCallback, useEffect, useRef, useState } from 'react';
import type { NoteName } from '../types';
import { CHROMATIC_NOTES, STANDARD_TUNING, getNoteAtFret } from '../data/notes';
import { usePitchDetector } from '../hooks/usePitchDetector';
import Fretboard from './Fretboard';
import SpectrumVisualizer from './SpectrumVisualizer';

const STRING_NAMES = ['Low E', 'A', 'D', 'G', 'B', 'High E'];
const MAX_EXERCISE_FRET = 11;
const TIMER_SECONDS = 60;

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
  const [total, setTotal] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [useMic, setUseMic] = useState(false);
  const [micTriggered, setMicTriggered] = useState(false);

  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [gameOver, setGameOver] = useState(false);
  const gameOverReasonRef = useRef<'time' | 'done'>('time');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPenalisedNote = useRef<NoteName | null>(null);
  const hadWrongAttempt = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const sessionDurationRef = useRef<number>(0);

  const { detectedNote, micError, clearDetected, analyserNode } = usePitchDetector(useMic);

  // Manage countdown when timedMode changes
  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (!timedMode) { setTimeLeft(TIMER_SECONDS); setGameOver(false); return; }

    setTimeLeft(TIMER_SECONDS);
    setGameOver(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          gameOverReasonRef.current = 'time';
          sessionDurationRef.current = TIMER_SECONDS;
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timedMode]);

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

  useEffect(() => {
    if (!useMic || micTriggered || !detectedNote || gameOver) return;
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
  }, [detectedNote, useMic, micTriggered, question, advance, gameOver]);

  function handleFretClick(stringIdx: number, fret: number) {
    if (gameOver || advanceTimer.current) return;
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
    if (gameOver) return;
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null; }
    setFeedback(null);
    setMicTriggered(false);
    lastPenalisedNote.current = null;
    hadWrongAttempt.current = false;
    clearDetected();
    setTotal(t => t + 1);
    setQuestion(randomQuestion(question.note));
  }

  function handleDone() {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    gameOverReasonRef.current = 'done';
    sessionDurationRef.current = (Date.now() - startTimeRef.current) / 1000;
    setGameOver(true);
  }

  function handleRestart() {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setQuestion(randomQuestion());
    setFeedback(null);
    setStreak(0);
    setTotal(1);
    setCorrect(0);
    setMicTriggered(false);
    lastPenalisedNote.current = null;
    hadWrongAttempt.current = false;
    clearDetected();
    startTimeRef.current = Date.now();
    sessionDurationRef.current = 0;
    setTimeLeft(TIMER_SECONDS);
    setGameOver(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          gameOverReasonRef.current = 'time';
          sessionDurationRef.current = TIMER_SECONDS;
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  const correctPositions = CHROMATIC_NOTES.map((_, i) => i).filter(fret =>
    fret <= MAX_EXERCISE_FRET &&
    getNoteAtFret(STANDARD_TUNING[question.stringIdx], fret) === question.note
  );

  const highlightedNotes = feedback?.correct
    ? correctPositions.map(fret => ({ string: question.stringIdx, fret, note: question.note, isRoot: true }))
    : [];

  const questionsAnswered = total - 1;
  const accuracy = questionsAnswered > 0 ? Math.round(correct / questionsAnswered * 100) : 0;
  const timePerNote = correct > 0 && sessionDurationRef.current > 0
    ? (sessionDurationRef.current / correct).toFixed(1) + 's'
    : '—';

  return (
    <div className="exercise-layout">
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <span className="game-over-emoji">{gameOverReasonRef.current === 'done' ? '🎸' : '⏰'}</span>
            <h2 className="game-over-title">{gameOverReasonRef.current === 'done' ? 'Session Results' : "Time's Up!"}</h2>
            <div className="game-over-score">
              <span className="game-over-big">{correct}</span>
              <span className="game-over-label">correct in 60s</span>
            </div>
            <p className="game-over-sub">
              {questionsAnswered > 0
                ? `${questionsAnswered} questions · ${accuracy}% accuracy`
                : 'No questions completed'}
            </p>
            {correct > 0 && (
              <p className="game-over-sub">
                <strong>{timePerNote}</strong> avg per correct note
              </p>
            )}
            <button className="ex-btn game-over-restart" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="exercise-card">
        <div className="exercise-header">
          <span className="exercise-title">Note Challenge</span>
          <div className="exercise-stats">
            {timedMode && (
              <span className={`stat-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                ⏱ {timeLeft}s
              </span>
            )}
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
          <button className="ex-btn done-btn" onClick={handleDone}>Done</button>
          <button className="ex-btn skip-btn" onClick={skip} disabled={gameOver}>Skip</button>
          <button
            className={`ex-btn mic-btn ${useMic ? 'active' : ''}`}
            onClick={() => { setUseMic(m => !m); setMicTriggered(false); }}
          >
            🎤 {useMic ? 'Mic On' : 'Use Mic'}
          </button>
          <button
            className={`ex-btn timed-btn ${timedMode ? 'active' : ''}`}
            onClick={() => setTimedMode(m => !m)}
          >
            ⏱ Timed
          </button>
        </div>

        {useMic && (
          <div className="mic-section">
            <div className="mic-status">
              {micError
                ? <span className="mic-error">{micError}</span>
                : <span className="mic-detected">
                    Hearing: <strong>{detectedNote ?? '—'}</strong>
                    {detectedNote === question.note && !micTriggered && ' ✓'}
                  </span>
              }
            </div>
            {!micError && <SpectrumVisualizer analyser={analyserNode} />}
          </div>
        )}

        {feedback?.correct && (
          <div className="exercise-success">
            ✨ {streak > 1 ? `${streak} in a row!` : 'Correct!'}
          </div>
        )}
      </div>

      <Fretboard
        highlightedNotes={highlightedNotes}
        mutedStrings={new Set()}
        showIntervals={false}
        onFretClick={gameOver ? undefined : handleFretClick}
        clickFeedback={feedback}
        highlightString={question.stringIdx}
        maxClickFret={MAX_EXERCISE_FRET}
      />
    </div>
  );
}
