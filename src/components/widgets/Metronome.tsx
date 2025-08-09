import React from 'react';
import { useProjectTiming } from '../../contexts/ProjectTimingContext';
import { useTransportOptional } from '../../contexts/TransportContext';

function useMetronome(bpm: number, numerator: number, denominator: number) {
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const nextNoteTimeRef = React.useRef<number>(0);
  const schedulerTimerRef = React.useRef<number | null>(null);
  const uiTimersRef = React.useRef<number[]>([]);
  const isRunningRef = React.useRef<boolean>(false);
  const [isRunning, setIsRunning] = React.useState(false);
  // Here, `beatsPerBar` means steps per bar based on signature-derived grid
  const [beatsPerBar, setBeatsPerBar] = React.useState(16);
  const [secondsPerStep, setSecondsPerStep] = React.useState(60 / bpm / 4);
  const [currentBeat, setCurrentBeat] = React.useState(0);
  const [accentLevels, setAccentLevels] = React.useState<number[]>(() => {
    // 0: silent, 1: subtle, 2: medium, 3: strong
    return Array.from({ length: 16 }, () => 0).map((_, i) => (i % 4 === 0 ? 2 : 0));
  });
  const accentLevelsRef = React.useRef<number[]>(accentLevels);
  React.useEffect(() => {
    accentLevelsRef.current = accentLevels;
  }, [accentLevels]);
  
  // Derive grid from signature: 4/X -> 16th grid; X=8 -> 8th grid; X=16 -> 16th grid
  React.useEffect(() => {
    const stepsPerDenominatorUnit = denominator === 4 ? 4 : denominator === 8 ? 1 : denominator === 16 ? 1 : 4;
    const totalSteps = Math.max(1, numerator * stepsPerDenominatorUnit);
    setBeatsPerBar(totalSteps);
    const secPerStep = (60.0 / bpm) * (4 / denominator) / stepsPerDenominatorUnit;
    setSecondsPerStep(secPerStep);
    // Default accents: quarters in 4/4 (every 4 steps), compound in 12/8 (every 3 steps), else bar start
    const base = Array.from({ length: totalSteps }, () => 0); // silent by default
    if (denominator === 4) {
      for (let i = 0; i < totalSteps; i += 4) base[i] = 2;
    } else if (denominator === 8 && numerator % 3 === 1) {
      // uncommon, fallback to start only
      base[0] = 2;
    } else if (denominator === 8 && numerator % 3 === 0) {
      for (let i = 0; i < totalSteps; i += 3) base[i] = 2;
    } else if (denominator === 16) {
      // try to accent quarters where possible (every 4 steps)
      for (let i = 0; i < totalSteps; i += 4) base[i] = 2;
    } else {
      base[0] = 2;
    }
    setAccentLevels(base);
    setCurrentBeat(0);
  }, [bpm, numerator, denominator]);
  const beatIndexRef = React.useRef<number>(0);

  const scheduleClick = React.useCallback((time: number, intensity: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (intensity === 0) return; // silent
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = intensity >= 3 ? 1700 : intensity === 2 ? 1350 : 1100;
    const duration = 0.035;
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    const startGain = intensity >= 3 ? 0.24 : intensity === 2 ? 0.16 : 0.11;
    gain.gain.setValueAtTime(startGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration);
  }, []);

  const nextNote = React.useCallback(() => {
    nextNoteTimeRef.current += secondsPerStep;
    beatIndexRef.current = (beatIndexRef.current + 1) % beatsPerBar;
  }, [secondsPerStep, beatsPerBar]);

  const scheduler = React.useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const scheduleAheadTime = 0.05;
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const beatIndex = beatIndexRef.current % beatsPerBar;
      const intensity = (accentLevelsRef.current[beatIndex] ?? 0);
      const playTime = nextNoteTimeRef.current;
      scheduleClick(playTime, intensity);
      const delayMs = Math.max(0, (playTime - ctx.currentTime) * 1000);
      const uiId = window.setTimeout(() => {
        setCurrentBeat(beatIndex);
      }, delayMs);
      uiTimersRef.current.push(uiId);
      nextNote();
    }
    schedulerTimerRef.current = window.setTimeout(scheduler, 20);
  }, [beatsPerBar, nextNote, scheduleClick]);

  const start = React.useCallback(async () => {
    if (isRunningRef.current) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    beatIndexRef.current = 0;
    setCurrentBeat(0);
    isRunningRef.current = true;
    setIsRunning(true);
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    scheduler();
  }, [scheduler]);

  // Resync schedule immediately on tempo/signature change while running
  React.useEffect(() => {
    const ctx = audioContextRef.current;
    if (!ctx || !isRunningRef.current) return;
    beatIndexRef.current = 0;
    setCurrentBeat(0);
    nextNoteTimeRef.current = ctx.currentTime + 0.03;
  }, [secondsPerStep, beatsPerBar]);

  const stop = React.useCallback(() => {
    if (!isRunningRef.current) return;
    isRunningRef.current = false;
    setIsRunning(false);
    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    // Clear pending UI timers
    uiTimersRef.current.forEach((id) => clearTimeout(id));
    uiTimersRef.current = [];
  }, []);

  // No external grid; presets handled in-component

  React.useEffect(() => {
    return () => {
      if (schedulerTimerRef.current) clearTimeout(schedulerTimerRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      uiTimersRef.current.forEach((id) => clearTimeout(id));
      uiTimersRef.current = [];
    };
  }, []);

  return {
    isRunning,
    beatsPerBar,
    currentBeat,
    start,
    stop,
    accentLevels,
    setAccentLevels,
    numerator,
    denominator,
  } as const;
}

export default function Metronome({ bpm }: { bpm?: number }) {
  const { bpm: projectBpm, numerator, denominator } = useProjectTiming();
  const { isRunning, beatsPerBar, currentBeat, start, stop, accentLevels, setAccentLevels } = useMetronome(projectBpm || bpm || 120, numerator, denominator);
  const transport = useTransportOptional();

  // Sync with global transport
  React.useEffect(() => {
    if (!transport) return;
    if (transport.isPlaying && !isRunning) start();
    if (!transport.isPlaying && isRunning) stop();
  }, [transport?.isPlaying, isRunning, start, stop, transport]);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <div className="text-sm uppercase tracking-widest text-white/60">Widget</div>
        <h3 className="text-lg font-semibold">Metronome</h3>
        <div className="mt-1 text-xs text-white/60">Time {numerator}/{denominator} • Tempo {Math.round(projectBpm || bpm || 120)} BPM</div>
      </div>

      <AccentPresets onApply={setAccentLevels} steps={beatsPerBar} numerator={numerator} denominator={denominator} />

      <Legend />

      <BeatAccents
        beatsPerBar={beatsPerBar}
        currentBeat={currentBeat}
        levels={accentLevels}
        onChange={(next) => setAccentLevels(next)}
      />
    </div>
  );
}

type BeatAccentsProps = {
  beatsPerBar: number;
  currentBeat: number;
  levels: number[];
  onChange: (levels: number[]) => void;
};

function BeatAccents({ beatsPerBar, currentBeat, levels, onChange }: BeatAccentsProps) {
  const cycle = (index: number) => {
    const next = [...levels];
    next[index] = ((next[index] ?? 0) + 1) % 4; // 0..3
    onChange(next);
  };

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: beatsPerBar }).map((_, i) => {
        const level = levels[i] ?? 0;
        const isNow = currentBeat % beatsPerBar === i;
        const bg = level >= 3 ? 'bg-white' : level === 2 ? 'bg-cyan-400/80' : level === 1 ? 'bg-white/30' : 'bg-white/10';
        const ring = isNow ? 'ring-2 ring-white/80' : '';
        return (
          <button
            key={i}
            type="button"
            aria-label={`Beat ${i + 1} accent level ${level}`}
            onClick={() => cycle(i)}
            className={`h-3 flex-1 rounded-full transition-all ${bg} ${ring}`}
          />
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="mb-3 flex items-center gap-3 text-xs text-white/60">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/10" />
        Silent (0)
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-white/30" />
        Subtle (1)
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400/80" />
        Medium (2)
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
        Strong (3)
      </span>
    </div>
  );
}

function AccentPresets({ onApply, steps, numerator, denominator }: { onApply: (levels: number[]) => void; steps: number; numerator: number; denominator: number }) {
  const apply = (key: string) => {
    const base = Array.from({ length: steps }, () => 0);
    if (key === 'quarters') {
      if (denominator === 4 || denominator === 16) {
        for (let i = 0; i < steps; i += 4) base[i] = 2;
      } else if (denominator === 8 && numerator % 3 === 0) {
        for (let i = 0; i < steps; i += 3) base[i] = 2;
      } else {
        base[0] = 2;
      }
    } else if (key === 'eighths') {
      const interval = denominator === 4 ? 2 : 1;
      for (let i = 0; i < steps; i += interval) base[i] = 2;
    } else if (key === 'bar') {
      base[0] = 3;
    }
    onApply(base);
  };
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-white/60">Accent presets:</span>
      <button onClick={() => apply('quarters')} className="rounded border border-white/10 bg-white/10 px-2 py-1 hover:bg-white/20">Quarter feel</button>
      <button onClick={() => apply('eighths')} className="rounded border border-white/10 bg-white/10 px-2 py-1 hover:bg-white/20">Eighth feel</button>
      <button onClick={() => apply('bar')} className="rounded border border-white/10 bg-white/10 px-2 py-1 hover:bg-white/20">Bar only</button>
    </div>
  );
}


