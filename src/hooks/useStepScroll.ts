import { useEffect } from "react";
import { useLenis } from "lenis/react";

const TOTAL_SECTIONS = 4; // Всего 4 секции на сайте

export function useStepScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // 1. Обработчик программного скролла (от кнопок меню или колесика)
    const handleNavJump = (e: Event) => {
      const targetPage = (e as CustomEvent).detail;
      const sections = document.querySelectorAll("[data-lenis-snap]");
      if (sections[targetPage]) {
        lenis.scrollTo(sections[targetPage] as HTMLElement, {
          duration: 1.2, // Длительность анимации прокрутки
          // Функция плавности (easeOutExpo): быстрый старт, мягкая остановка
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };

    // 2. Обработчик колесика мыши (ПК)
    const handleWheel = (e: WheelEvent) => {
      // На мобильных (ширина < 768) игнорируем
      if (window.innerWidth < 768) return;

      // Если открыто модальное окно проекта — не перехватываем скролл
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;

      e.preventDefault(); // Отменяем нативный скролл

      const sections = Array.from(document.querySelectorAll("[data-lenis-snap]"));
      if (!sections.length) return;

      const currentScroll = lenis.scroll;
      let currentPage = 0;
      let minDist = Infinity;

      // Ищем секцию, к которой мы сейчас ближе всего
      sections.forEach((sec, idx) => {
        const dist = Math.abs((sec as HTMLElement).offsetTop - currentScroll);
        if (dist < minDist) {
          minDist = dist;
          currentPage = idx;
        }
      });

      // Определяем направление скролла
      const direction = e.deltaY > 0 ? 1 : -1;
      let nextPage = currentPage + direction;
      nextPage = Math.max(0, Math.min(nextPage, TOTAL_SECTIONS - 1)); // Ограничиваем 0-3

      if (nextPage !== currentPage) {
        window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: nextPage }));
      }
    };

    // === 3. ЛОГИКА СВАЙПОВ НА МОБИЛЬНЫХ ===
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;
      touchStartY = e.touches[0].clientY; // Запоминаем точку касания
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;
      e.preventDefault(); // Блокируем нативный скролл пальцем
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const isModalOpen =
        e.target instanceof HTMLElement && e.target.closest('[class*="modalOverlay"]');
      if (isModalOpen) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY; // Вычисляем длину свайпа

      // Если свайп больше 30 пикселей — переключаем секцию
      if (Math.abs(deltaY) > 30) {
        const direction = deltaY > 0 ? 1 : -1;

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

        let nextPage = currentPage + direction;
        nextPage = Math.max(0, Math.min(nextPage, TOTAL_SECTIONS - 1));

        if (nextPage !== currentPage) {
          window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: nextPage }));
        }
      }
    };

    // 4. Подписываемся на все события
    window.addEventListener("nav-jump-to", handleNavJump);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // 5. Очистка при размонтировании
    return () => {
      window.removeEventListener("nav-jump-to", handleNavJump);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [lenis]);
}
