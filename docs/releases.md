# Releases

## 1.0.0 (TBD)

### Highlights
- Animated landing page with Tailwind styling and animated background
- Discover → Builder workflow
- Modular Builder with widgets and local persistence
- Timing widget: single source of truth for BPM and time signature
- Global transport (Play/Stop, Spacebar) for future multiple sound sources
- Metronome widget: low-latency Web Audio click with per-step accents and presets

### Details
- Builder auto-adds and pins a Timing widget on new projects
- Add/Remove/Reorder widgets; state persisted to localStorage
- Global transport provider: unified playback for all widgets now and in the future
- Timing: high-contrast BPM slider with live updates; time signature inputs allow empty editing and apply on blur
- Metronome: sample-accurate UI/audio alignment; subdivisions derived from signature (e.g., 4/4 → 16th grid, 12/8 → 8th grouping); per-step accent levels (0 Silent / 1 / 2 / 3) with instant application; presets (Quarter feel, Eighth feel, Bar only)

### Known Limitations
- Metronome accent patterns not persisted per widget instance yet
- No drag painting, right-click decrement, or tap tempo

### Next
- Persist per-widget accent patterns
- Extended preset templates (e.g., 5/8 as 3+2, 7/8 variants)
- Tap tempo and keyboard shortcuts
