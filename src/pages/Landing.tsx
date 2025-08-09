import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute -top-32 -left-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/40 blur-3xl animate-[blob_16s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-24 h-[26rem] w-[26rem] rounded-full bg-cyan-500/40 blur-3xl animate-[blob_18s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-24 left-1/4 h-[30rem] w-[30rem] rounded-full bg-indigo-600/40 blur-3xl animate-[blob_20s_ease-in-out_infinite]" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(139,42,255,0.25),transparent),radial-gradient(800px_400px_at_100%_20%,rgba(34,211,238,0.18),transparent)] animate-[gradientShift_18s_ease_infinite]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-lg shadow-fuchsia-600/30" />
          <span className="text-xl font-semibold tracking-tight">GrooveForge</span>
        </div>
        <nav className="hidden md:flex items-center gap-4 text-sm text-white/80">
          <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col gap-6">
          <h1 className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-7xl">
            Craft beats. Remix ideas. Ship sound.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/80">
            GrooveForge is your modern studio in the browser. Build loops, sculpt textures, and prototype tracks with elegance and speed.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-fuchsia-600 px-6 py-3 font-medium text-white shadow-lg shadow-fuchsia-600/30 transition hover:bg-fuchsia-500"
            >
              Login
            </Link>
            <Link
              to="/discover"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              Explore features
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4 text-xs text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live demo preview
            </span>
            <span>Zero install • Runs in your browser</span>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur">
            <div className="grid h-full w-full grid-cols-6 gap-2 rounded-xl bg-black/40 p-3">
              <div className="col-span-4 rounded-lg bg-gradient-to-br from-fuchsia-400/30 via-violet-400/20 to-cyan-300/20" />
              <div className="col-span-2 grid grid-rows-3 gap-2">
                <div className="rounded-lg bg-white/10" />
                <div className="rounded-lg bg-white/10" />
                <div className="rounded-lg bg-white/10" />
              </div>
              <div className="col-span-6 grid grid-cols-8 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-gradient-to-t from-white/5 to-white/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} GrooveForge. All rights reserved.
      </footer>
    </main>
  );
}


