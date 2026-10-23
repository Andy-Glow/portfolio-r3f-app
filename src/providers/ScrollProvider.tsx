import { ReactLenis, useLenis } from "lenis/react";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

// 1. Создаем контекст. Мы храним в нем не само число, а "ссылку" (MutableRefObject) на него.
const ScrollProgressContext = createContext<React.MutableRefObject<number> | null>(null);

// Кастомный хук для удобного доступа к прогрессу скролла
export const useScrollProgress = () => {
  const context = useContext(ScrollProgressContext);
  if (!context) throw new Error("useScrollProgress must be used within ScrollProvider");
  return context;
};

// 2. Внутренний компонент-трекер
function LenisTracker({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Отключаем нативное восстановление скролла браузером при перезагрузке страницы
    history.scrollRestoration = "manual";

    // Принудительно скроллим на самый верх при загрузке
    lenis.scrollTo(0, { immediate: true });

    // Обновляем ref-значение при каждом событии скролла (без вызова ререндера React)
    const onScroll = ({ progress }: any) => {
      progressRef.current = progress;
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, progressRef]);

  return null;
}

// 3. Главный провайдер
export function ScrollProvider({ children }: { children: ReactNode }) {
  // Используем useRef для хранения прогресса. Это критически важно для производительности!
  const progressRef = useRef(0);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // Плавность (меньше = плавнее)
        duration: 1.2, // Длительность прокрутки
        smoothWheel: false, // Отключаем встроенный скролл Lenis, так как шагами управляем сами
      }}>
      <LenisTracker progressRef={progressRef} />

      {/* Передаем ссылку вниз по дереву */}
      <ScrollProgressContext.Provider value={progressRef}>
        {children}
      </ScrollProgressContext.Provider>
    </ReactLenis>
  );
}
