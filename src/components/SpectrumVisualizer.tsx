import { useEffect, useRef } from 'react';

const NUM_BARS = 64;
const MAX_FREQ = 4000; // Hz — covers guitar fundamentals + harmonics

export default function SpectrumVisualizer({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const sampleRate = analyser.context.sampleRate;
    const hzPerBin = sampleRate / analyser.fftSize;
    const maxBin = Math.min(Math.floor(MAX_FREQ / hzPerBin), bufferLength);
    const binsPerBar = Math.max(1, Math.floor(maxBin / NUM_BARS));

    // Gradient runs top (mauve) → bottom (teal), reused every frame
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0,   '#B47EB3'); // mauve
    gradient.addColorStop(0.5, '#92D1C3'); // teal
    gradient.addColorStop(1,   '#FDF5BF'); // yellow (only visible on very quiet signal)

    let rafId: number;

    function draw() {
      rafId = requestAnimationFrame(draw);
      analyser!.getByteFrequencyData(dataArray);

      const { width, height } = canvas!;
      ctx.clearRect(0, 0, width, height);

      const gap = 2;
      const barW = (width - gap * (NUM_BARS - 1)) / NUM_BARS;

      ctx.fillStyle = gradient;
      for (let i = 0; i < NUM_BARS; i++) {
        let sum = 0;
        const start = i * binsPerBar;
        for (let b = 0; b < binsPerBar; b++) sum += dataArray[start + b];
        const barH = (sum / binsPerBar / 255) * height;
        const x = i * (barW + gap);
        ctx.fillRect(x, height - barH, barW, barH);
      }
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [analyser]);

  return <canvas ref={canvasRef} className="spectrum-canvas" width={640} height={72} />;
}
