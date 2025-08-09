## Metronome Widget

### Overview
The Metronome provides a low-latency click track with per-step accents and musical presets, driven by the project BPM and time signature.

### Behavior
- Syncs to project BPM and time signature (via context) and to the global transport (Play/Stop, Spacebar).
- Derives a step grid by signature (e.g., 4/4 → 16th steps; 12/8 → groups of three eighths).
- Per-step accents: 0 (Silent), 1 (Subtle), 2 (Medium), 3 (Strong), applied instantly in audio.
- Visual indicator is sample-accurate aligned with the click via scheduled UI updates.

### Presets
- Quarter feel: accents quarter notes (or every three in compound meters like 12/8).
- Eighth feel: accents eighth subdivisions (contextual to the signature).
- Bar only: accents only the first step of the bar.

### Roadmap
- Tap tempo.
- Right-click or modifier to decrement accents.
- Drag painting across steps.
- Save/load accent templates.


