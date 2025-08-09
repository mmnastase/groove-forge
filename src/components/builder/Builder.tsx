import React from 'react';
import Metronome from '../widgets/Metronome';
import Timing from '../widgets/Timing';
import { ProjectTimingProvider } from '../../contexts/ProjectTimingContext';

type WidgetType = 'timing' | 'metronome';

type BuilderWidget = {
  id: string;
  type: WidgetType;
};

export default function Builder() {
  const [signature, setSignature] = React.useState<{ n: number; d: number }>({ n: 4, d: 4 });
  const [widgets, setWidgets] = React.useState<BuilderWidget[]>([]);

  // persistence
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('gf_project');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data?.bpm === 'number') {/* owned by context; ignore here */}
      if (Array.isArray(data?.widgets)) setWidgets(data.widgets);
      if (typeof data?.signature?.n === 'number' && typeof data?.signature?.d === 'number') setSignature({ n: data.signature.n, d: data.signature.d });
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    const snapshot = {
      bpm: undefined,
      widgets,
      signature,
    };
    try {
      localStorage.setItem('gf_project', JSON.stringify(snapshot));
    } catch {
      // ignore quota
    }
  }, [widgets, signature]);

  const addWidget = (type: WidgetType) => {
    setWidgets((prev) => [...prev, { id: `${type}-${Date.now()}`, type }]);
  };

  const hasTiming = React.useMemo(() => widgets.some((w) => w.type === 'timing'), [widgets]);

  React.useEffect(() => {
    if (!hasTiming) {
      setWidgets([{ id: `timing-${Date.now()}`, type: 'timing' }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderWidget = (w: BuilderWidget) => {
    if (w.type === 'timing') return <Timing />;
    if (w.type === 'metronome') return <Metronome />;
    return null;
  };

  return (
    <ProjectTimingProvider initialBpm={100} initialNumerator={signature.n} initialDenominator={signature.d}>
      <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative mx-auto w-full max-w-7xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Builder</h1>
          <p className="text-white/60">Add widgets and shape your project</p>
        </header>

        {widgets.length === 0 ? (
          <div className="mb-8 rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/70">
            Your project is empty. Add your first widget.
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pinned Timing widgets first */}
          {widgets
            .filter((w) => w.type === 'timing')
            .map((w) => (
              <div key={w.id}>{renderWidget(w)}</div>
            ))}

          {/* Other widgets follow */}
          {widgets
            .filter((w) => w.type !== 'timing')
            .map((w) => (
              <div key={w.id} className="group relative">
                <div className="absolute -top-3 right-0 hidden gap-2 group-hover:flex">
                  <WidgetControls id={w.id} widgets={widgets} setWidgets={setWidgets} />
                </div>
                {renderWidget(w)}
              </div>
            ))}
        </section>

        <div className="mt-8">
          <AddWidgetBar onAdd={(type) => addWidget(type)} hideTiming={hasTiming} />
        </div>
      </div>
      </div>
    </ProjectTimingProvider>
  );
}

function AddWidgetBar({ onAdd, hideTiming }: { onAdd: (type: WidgetType) => void; hideTiming?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {!hideTiming && (
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/20"
          onClick={() => onAdd('timing')}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
          Add Timing
        </button>
      )}
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/20"
        onClick={() => onAdd('metronome')}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-fuchsia-500" />
        Add Metronome
      </button>
    </div>
  );
}

function WidgetControls({ id, widgets, setWidgets }: { id: string; widgets: BuilderWidget[]; setWidgets: React.Dispatch<React.SetStateAction<BuilderWidget[]>> }) {
  const index = widgets.findIndex((w) => w.id === id);
  const move = (dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= widgets.length) return;
    const next = [...widgets];
    const [item] = next.splice(index, 1);
    next.splice(j, 0, item);
    setWidgets(next);
  };
  const remove = () => setWidgets((prev) => prev.filter((w) => w.id !== id));

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 p-1 text-xs backdrop-blur">
      <button onClick={() => move(-1)} className="rounded px-2 py-1 hover:bg-white/10">↑</button>
      <button onClick={() => move(1)} className="rounded px-2 py-1 hover:bg-white/10">↓</button>
      <button onClick={remove} className="rounded px-2 py-1 text-red-300 hover:bg-white/10">Remove</button>
    </div>
  );
}


