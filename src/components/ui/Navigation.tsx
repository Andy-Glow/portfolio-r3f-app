import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import styles from "./Navigation.module.scss";

// 1. Статический список пунктов меню
const NAV_ITEMS = [
  { label: "Инфо", page: 0 },
  { label: "Навыки", page: 1 },
  { label: "Проекты", page: 2 },
  { label: "Контакты", page: 3 },
];

export function Navigation() {
  // Получаем доступ к экземпляру Lenis для управления скроллом
  const lenis = useLenis();
  // Стейт для отслеживания активной (текущей) страницы
  const [activePage, setActivePage] = useState(0);

  // 2. Подписываемся на события скролла Lenis, чтобы обновлять активную кнопку
  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ progress }: { progress: number }) => {
      // progress — это число от 0 до 1 (0 - верх, 1 - низ).
      // Умножаем на 3 (так как 4 страницы), чтобы получить индекс текущей страницы (0, 1, 2, 3)
      const currentPage = Math.round(progress * 3);
      setActivePage(currentPage);
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll); // Отписываемся при размонтировании
  }, [lenis]);

  // 3. Обработчик клика по кнопке меню
  const handleClick = (page: number) => {
    // Если кликнули по уже активной кнопке или Lenis еще не загрузился — ничего не делаем
    if (page === activePage || !lenis) return;

    // Отправляем кастомное событие, которое перехватит useStepScroll и запустит скролл
    window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: page }));
  };

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.page}
          onClick={() => handleClick(item.page)}
          className={styles.navItem}
          // 4. Отключаем кнопку, если это текущая страница
          disabled={item.page === activePage}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
