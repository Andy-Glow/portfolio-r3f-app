import { useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function ScrollTracker() {
  const scroll = useScroll();
  const lastPage = useRef(0);

  useFrame(() => {
    if (!scroll) return;

    const currentPage = Math.round(scroll.offset * (scroll.pages - 1));

    // Если страница изменилась — сообщаем всему приложению
    if (currentPage !== lastPage.current) {
      lastPage.current = currentPage;
      window.dispatchEvent(new CustomEvent("page-changed", { detail: currentPage }));
    }
  });

  return null; // Этот компонент ничего не рисует
}
