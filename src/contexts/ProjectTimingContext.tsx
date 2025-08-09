import React from 'react';

export type ProjectTiming = {
  bpm: number;
  numerator: number;
  denominator: number;
  setBpm: (bpm: number) => void;
  setSignature: (numerator: number, denominator: number) => void;
};

const ProjectTimingContext = React.createContext<ProjectTiming | null>(null);

export function useProjectTiming(): ProjectTiming {
  const ctx = React.useContext(ProjectTimingContext);
  if (!ctx) throw new Error('useProjectTiming must be used within ProjectTimingProvider');
  return ctx;
}

export function ProjectTimingProvider({
  children,
  initialBpm,
  initialNumerator,
  initialDenominator,
}: {
  children: React.ReactNode;
  initialBpm: number;
  initialNumerator: number;
  initialDenominator: number;
}) {
  const [bpm, setBpm] = React.useState<number>(initialBpm);
  const [numerator, setNumerator] = React.useState<number>(initialNumerator);
  const [denominator, setDenominator] = React.useState<number>(initialDenominator);

  const setSignature = (n: number, d: number) => {
    setNumerator(n);
    setDenominator(d);
  };

  const value = React.useMemo<ProjectTiming>(
    () => ({ bpm, numerator, denominator, setBpm, setSignature }),
    [bpm, numerator, denominator]
  );

  return <ProjectTimingContext.Provider value={value}>{children}</ProjectTimingContext.Provider>;
}


