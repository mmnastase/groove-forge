export type GridModeKey = '4-4_q' | '8-8_e' | '12-8_e3' | '4-4_16' | '4-4_32' | '4-4_16t';

export const GRID_LABELS: Record<GridModeKey, string> = {
  '4-4_q': '4/4 – quarter notes (equal accents)',
  '8-8_e': '8/8 – eighths, accent quarters',
  '12-8_e3': '12/8 – accent every three (quarter feel)',
  '4-4_16': '4/4 – 16th notes (accent quarters)',
  '4-4_32': '4/4 – 32nd notes (accent quarters)',
  '4-4_16t': '4/4 – 16th-triplets (2,0,0,1,0,0)',
};

export type GridConfig = {
  beatsPerBar: number; // total steps per bar for this grid
  stepsPerQuarter: number; // steps per quarter note
  presetAccentLevels: number[]; // default accent pattern for the bar
};

export function getGridConfig(mode: GridModeKey): GridConfig {
  switch (mode) {
    case '4-4_q': {
      return {
        beatsPerBar: 4,
        stepsPerQuarter: 1,
        presetAccentLevels: Array.from({ length: 4 }, () => 1),
      };
    }
    case '8-8_e': {
      const pattern = Array.from({ length: 8 }, (_, i) => (i % 2 === 0 ? 1 : 0));
      return { beatsPerBar: 8, stepsPerQuarter: 2, presetAccentLevels: pattern };
    }
    case '12-8_e3': {
      const pattern = Array.from({ length: 12 }, (_, i) => (i % 3 === 0 ? 1 : 0));
      return { beatsPerBar: 12, stepsPerQuarter: 3, presetAccentLevels: pattern };
    }
    case '4-4_16': {
      const pattern = Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? 1 : 0));
      return { beatsPerBar: 16, stepsPerQuarter: 4, presetAccentLevels: pattern };
    }
    case '4-4_32': {
      const pattern = Array.from({ length: 32 }, (_, i) => (i % 8 === 0 ? 1 : 0));
      return { beatsPerBar: 32, stepsPerQuarter: 8, presetAccentLevels: pattern };
    }
    case '4-4_16t': {
      const perBeat = [2, 0, 0, 1, 0, 0];
      const pattern = Array.from({ length: 24 }, (_, i) => perBeat[i % 6]);
      return { beatsPerBar: 24, stepsPerQuarter: 6, presetAccentLevels: pattern };
    }
    default: {
      return { beatsPerBar: 4, stepsPerQuarter: 1, presetAccentLevels: [1, 1, 1, 1] };
    }
  }
}


