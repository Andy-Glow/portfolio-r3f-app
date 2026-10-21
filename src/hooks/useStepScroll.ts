import { useEffect } from "react";
import { useScroll } from "@react-three/drei";

export function useStepScroll() {
  const scroll = useScroll();

  useEffect(() => {
    if (!scroll.el) return;

    let isAnimating = false;

    const scrollToPage = (direction: number) => {
      if (isAnimating) return;

      const currentPage = Math.round(scroll.offset * (scroll.pages - 1));
      let nextPage = currentPage + direction;

      // Ограничиваем диапазон страниц
      nextPage = Math.max(0, Math.min(nextPage, scroll.pages - 1));

      if (nextPage === currentPage) return;

      isAnimating = true;
      const targetScrollTop =
        (nextPage / (scroll.pages - 1)) * (scroll.el.scrollHeight - scroll.el.clientHeight);

      scroll.el.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });

      // Блокируем скролл на время анимации (400 мс)
      setTimeout(() => {
        isAnimating = false;
      }, 450);
    };

    // 1. Обработка колесика мыши (Desktop)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToPage(direction);
    };

    // 2. Обработка тач-свайпов (Mobile)
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Если палец сдвинулся больше чем на 30 пикселей — считаем это свайпом
      if (Math.abs(deltaY) > 30) {
        const direction = deltaY > 0 ? 1 : -1; // Свайп вверх = 1 (вниз по странице)
        scrollToPage(direction);
      }
    };

    const container = scroll.el;

    // Добавляем слушатели
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Отключаем стандартное поведение скролла (важно для iOS)
    container.style.touchAction = "pan-y";

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scroll]);
}
