import { useEffect } from "react";
import { useLenis } from "lenis/react";

const TOTAL_SECTIONS = 4;

// Вспомогательная функция для поиска ближайшей секции
function getCurrentPage(lenis: any) {
  const sections = Array.from(document.querySelectorAll("[data-lenis-snap]"));
  const currentScroll = lenis.scroll;
  let currentPage = 0;
  let minDist = Infinity;

  sections.forEach((sec, idx) => {
    const dist = Math.abs((sec as HTMLElement).offsetTop - currentScroll);
    if (dist < minDist) {
      minDist = dist;
      currentPage = idx;
    }
  });

  return currentPage;
}

export function useScrollGestures() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // 1. ОБРАБОТКА КОЛЕСИКА (ПК)
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;

      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;

      e.preventDefault();

      const currentPage = getCurrentPage(lenis);
      const direction = e.deltaY > 0 ? 1 : -1;
      let nextPage = currentPage + direction;
      nextPage = Math.max(0, Math.min(nextPage, TOTAL_SECTIONS - 1));

      if (nextPage !== currentPage) {
        window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: nextPage }));
      }
    };

    // 2. ОБРАБОТКА СВАЙПОВ (Мобильные)
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;

      e.preventDefault(); // Отключаем нативный скролл
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 30) {
        const direction = deltaY > 0 ? 1 : -1;
        const currentPage = getCurrentPage(lenis);

        let nextPage = currentPage + direction;
        nextPage = Math.max(0, Math.min(nextPage, TOTAL_SECTIONS - 1));

        if (nextPage !== currentPage) {
          window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: nextPage }));
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [lenis]);
}
