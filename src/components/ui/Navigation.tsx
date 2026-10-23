import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import styles from "./Navigation.module.scss";

const NAV_ITEMS = [
  { label: "Инфо", page: 0 },
  { label: "Навыки", page: 1 },
  { label: "Проекты", page: 2 },
  { label: "Контакты", page: 3 },
];

export function Navigation() {
  const lenis = useLenis();
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    if (!lenis) return;
    const handleScroll = ({ progress }: { progress: number }) => {
      const currentPage = Math.round(progress * 3);
      setActivePage(currentPage);
    };
    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  const handleClick = (page: number) => {
    if (page === activePage || !lenis) return;
    window.dispatchEvent(new CustomEvent("nav-jump-to", { detail: page }));
  };

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.page}
          onClick={() => handleClick(item.page)}
          className={styles.navItem}
          disabled={item.page === activePage}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
