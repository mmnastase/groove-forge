import React from 'react';

export type Transport = {
  isPlaying: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
};

const TransportContext = React.createContext<Transport | null>(null);

export function useTransportOptional(): Transport | null {
  return React.useContext(TransportContext);
}

export function TransportProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const start = React.useCallback(() => setIsPlaying(true), []);
  const stop = React.useCallback(() => setIsPlaying(false), []);
  const toggle = React.useCallback(() => setIsPlaying((p) => !p), []);

  const value = React.useMemo<Transport>(() => ({ isPlaying, start, stop, toggle }), [isPlaying, start, stop, toggle]);

  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
}


