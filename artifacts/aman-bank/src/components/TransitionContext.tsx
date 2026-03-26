import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLocation } from "wouter";
import { PageLoader } from "./PageLoader";

interface TransitionContextValue {
  navigateTo: (path: string) => void;
  navigateBack: () => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateTo: () => {},
  navigateBack: () => {},
});

export function useNavigate() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const navigateTo = useCallback((path: string) => {
    setLoading(true);
    setTimeout(() => {
      setHistory(h => [...h, path]);
      setLocation(path);
      setTimeout(() => setLoading(false), 150);
    }, 750);
  }, [setLocation]);

  const navigateBack = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setHistory(h => {
        const newH = h.slice(0, -1);
        const prev = newH[newH.length - 1] ?? "/";
        setLocation(prev);
        return newH;
      });
      setTimeout(() => setLoading(false), 150);
    }, 750);
  }, [setLocation]);

  return (
    <TransitionContext.Provider value={{ navigateTo, navigateBack }}>
      {children}
      <PageLoader visible={loading} />
    </TransitionContext.Provider>
  );
}
