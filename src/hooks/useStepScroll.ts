import { useEffect } from "react";
import { useScroll } from "@react-three/drei";

export function useStepScroll() {
  const scroll = useScroll();

  useEffect(() => {
    const handleNavJump = (e: Event) => {
      const targetPage = (e as CustomEvent).detail;
      const el = scroll.el;
      if (!el) return;

      const pages = scroll.pages;
      const scrollRange = el.scrollHeight - el.clientHeight;
      const targetScrollTop = (targetPage / (pages - 1)) * scrollRange;

      el.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    };

    const handleWheel = (e: WheelEvent) => {
      // На мобильных отключаем скролл
      if (window.innerWidth < 768) {
        e.preventDefault();
        return;
      }

      // Если открыто модальное окно проекта, даем ему скроллиться
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;

      e.preventDefault();

      const currentPage = Math.round(scroll.offset * (scroll.pages - 1));
      const direction = e.deltaY > 0 ? 1 : -1;
      let nextPage = currentPage + direction;
      nextPage = Math.max(0, Math.min(nextPage, scroll.pages - 1));

      if (nextPage !== currentPage) {
        window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: nextPage }));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth < 768) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("nav-jump-to", handleNavJump);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("nav-jump-to", handleNavJump);
    };
  }, [scroll]);
}
