import React from 'react';
import { useProjectTiming } from '../../contexts/ProjectTimingContext';

export default function Timing() {
  const { bpm, setBpm, numerator, denominator, setSignature } = useProjectTiming();
  const [numInput, setNumInput] = React.useState<string>(String(numerator));
  const [denInput, setDenInput] = React.useState<string>(String(denominator));

  // Keep placeholders in sync; don't overwrite while user is editing (we only init once)
  React.useEffect(() => {
    setNumInput(String(numerator));
  }, [numerator]);
  React.useEffect(() => {
    setDenInput(String(denominator));
  }, [denominator]);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <div className="text-sm uppercase tracking-widest text-white/60">Widget</div>
        <h3 className="text-lg font-semibold">Timing</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs text-white/60">Project tempo (BPM)</span>
          <input
            type="range"
            min={40}
            max={220}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            onInput={(e) => setBpm(Number((e.target as HTMLInputElement).value))}
            className="w-full accent-fuchsia-400 [--tw-shadow:0_0_0_2px_rgba(255,255,255,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{ filter: 'drop-shadow(0 0 0.2rem rgba(255,255,255,0.25))' }}
          />
          <span className="text-sm">{bpm} BPM</span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs text-white/60">Time signature</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={32}
              value={numInput}
              placeholder={String(numerator)}
              onChange={(e) => setNumInput(e.target.value)}
              onInput={(e) => setNumInput((e.target as HTMLInputElement).value)}
              onBlur={() => {
                if (numInput === '') return; // allow empty to persist visually
                const parsed = parseInt(numInput, 10);
                if (!Number.isNaN(parsed)) {
                  const clamped = Math.min(32, Math.max(1, parsed));
                  setSignature(clamped, denominator);
                }
              }}
              className="w-20 rounded-lg border border-white/10 bg-white/10 p-2 text-sm backdrop-blur"
            />
            <span className="text-white/50">/</span>
            <input
              type="number"
              min={1}
              max={64}
              step={1}
              value={denInput}
              placeholder={String(denominator)}
              onChange={(e) => setDenInput(e.target.value)}
              onInput={(e) => setDenInput((e.target as HTMLInputElement).value)}
              onBlur={() => {
                if (denInput === '') return;
                const parsed = parseInt(denInput, 10);
                if (!Number.isNaN(parsed)) {
                  const clamped = Math.min(64, Math.max(1, parsed));
                  setSignature(numerator, clamped);
                }
              }}
              className="w-20 rounded-lg border border-white/10 bg-white/10 p-2 text-sm backdrop-blur"
            />
          </div>
          <span className="text-[11px] text-white/40">Examples: 4/4, 7/8, 13/16</span>
        </label>

      </div>
    </div>
  );
}

