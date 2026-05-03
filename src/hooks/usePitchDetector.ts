import { useCallback, useEffect, useRef, useState } from 'react';
import type { NoteName } from '../types';
import { CHROMATIC_NOTES } from '../data/notes';

function detectFreq(buffer: Float32Array, sampleRate: number): number {
  const n = buffer.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buffer[i] * buffer[i];
  if (Math.sqrt(rms / n) < 0.015) return -1;

  const minPeriod = Math.floor(sampleRate / 1050);
  const maxPeriod = Math.min(Math.floor(sampleRate / 65), Math.floor(n / 2));

  let bestPeriod = -1;
  let bestCorr = -Infinity;
  for (let p = minPeriod; p <= maxPeriod; p++) {
    let corr = 0;
    const limit = n - p;
    for (let i = 0; i < limit; i++) corr += buffer[i] * buffer[i + p];
    if (corr > bestCorr) { bestCorr = corr; bestPeriod = p; }
  }
  return bestPeriod > 0 ? sampleRate / bestPeriod : -1;
}

function freqToNote(freq: number): NoteName {
  const semitones = Math.round(12 * Math.log2(freq / 440));
  const idx = ((69 + semitones) % 12 + 12) % 12;
  return CHROMATIC_NOTES[idx];
}

const STABILITY = 4;

export function usePitchDetector(active: boolean) {
  const [detectedNote, setDetectedNote] = useState<NoteName | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Refs so clearDetected() can reach into the running tick loop
  const lastNoteRef  = useRef<NoteName | null>(null);
  const sameCountRef = useRef(0);

  const clearDetected = useCallback(() => {
    setDetectedNote(null);
    lastNoteRef.current  = null;
    sameCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (!active) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      clearDetected();
      setAnalyserNode(null);
      return;
    }

    let cancelled = false;
    let rafId = 0;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 4096;
        ctx.createMediaStreamSource(stream).connect(analyser);
        setAnalyserNode(analyser);

        const buffer = new Float32Array(analyser.fftSize);

        const tick = () => {
          if (cancelled) return;
          analyser.getFloatTimeDomainData(buffer);
          const freq = detectFreq(buffer, ctx.sampleRate);
          if (freq > 0) {
            const note = freqToNote(freq);
            if (note === lastNoteRef.current) {
              sameCountRef.current++;
              if (sameCountRef.current >= STABILITY) setDetectedNote(note);
            } else {
              lastNoteRef.current  = note;
              sameCountRef.current = 1;
            }
          } else {
            sameCountRef.current = 0;
          }
          rafId = requestAnimationFrame(tick);
        };
        tick();

        cleanupRef.current = () => {
          cancelled = true;
          cancelAnimationFrame(rafId);
          stream.getTracks().forEach(t => t.stop());
          ctx.close();
          setAnalyserNode(null);
        };
      })
      .catch(() => {
        if (!cancelled) setMicError('Microphone access denied.');
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanupRef.current?.();
    };
  }, [active, clearDetected]);

  return { detectedNote, micError, clearDetected, analyserNode };
}
