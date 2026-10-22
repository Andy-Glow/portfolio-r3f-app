import { useEffect } from "react";
import { useScroll } from "@react-three/drei";

export function useStepScroll() {
  const scroll = useScroll();

  useEffect(() => {
    if (!scroll.el) return;

    let isAnimating = false;

    // Функция для сброса блокировки (если пользователь переключил вкладку)
    const resetLock = () => {
      isAnimating = false;
    };

    const scrollToPage = (direction: number) => {
      if (isAnimating) return;

      const currentPage = Math.round(scroll.offset * (scroll.pages - 1));
      let nextPage = currentPage + direction;

      nextPage = Math.max(0, Math.min(nextPage, scroll.pages - 1));

      if (nextPage === currentPage) return;

      isAnimating = true;
      const targetScrollTop =
        (nextPage / (scroll.pages - 1)) * (scroll.el.scrollHeight - scroll.el.clientHeight);

      scroll.el.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });

      // Блокируем скролл на время анимации
      setTimeout(resetLock, 800);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToPage(direction);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 30) {
        const direction = deltaY > 0 ? 1 : -1;
        scrollToPage(direction);
      }
    };

    const container = scroll.el;
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.style.touchAction = "pan-y";

    // Слушатели для разблокировки скролла при возврате на вкладку
    window.addEventListener("blur", resetLock);
    document.addEventListener("visibilitychange", resetLock);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("blur", resetLock);
      document.removeEventListener("visibilitychange", resetLock);
    };
  }, [scroll]);
}
