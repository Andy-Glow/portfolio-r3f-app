import { useState, useEffect } from "react";
import styles from "./Navigation.module.scss";

const NAV_ITEMS = [
  { label: "Инфо", page: 0 },
  { label: "Навыки", page: 1 },
  { label: "Проекты", page: 2 },
  { label: "Контакты", page: 3 },
];

export function Navigation() {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const handlePageChange = (e: Event) => {
      setActivePage((e as CustomEvent).detail);
    };
    window.addEventListener("page-changed", handlePageChange);
    return () => window.removeEventListener("page-changed", handlePageChange);
  }, []);

  const handleClick = (page: number) => {
    if (page === activePage) return;
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
