import { ReactLenis, useLenis } from "lenis/react";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

const ScrollProgressContext = createContext<React.MutableRefObject<number> | null>(null);

export const useScrollProgress = () => {
  const context = useContext(ScrollProgressContext);
  if (!context) throw new Error("useScrollProgress must be used within ScrollProvider");
  return context;
};

function LenisTracker({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    history.scrollRestoration = "manual";
    lenis.scrollTo(0, { immediate: true });
    const onScroll = ({ progress }: any) => {
      progressRef.current = progress;
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, progressRef]);
  return null;
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef(0);
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: false }}>
      <LenisTracker progressRef={progressRef} />
      <ScrollProgressContext.Provider value={progressRef}>
        {children}
      </ScrollProgressContext.Provider>
    </ReactLenis>
  );
}
