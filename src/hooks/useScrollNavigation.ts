import { useEffect } from "react";
import { useLenis } from "lenis/react";

export function useScrollNavigation() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleNavJump = (e: Event) => {
      const targetPage = (e as CustomEvent).detail;
      const sections = document.querySelectorAll("[data-lenis-snap]");

      if (sections[targetPage]) {
        lenis.scrollTo(sections[targetPage] as HTMLElement, {
          duration: 1.2,
          // Плавная кривая замедления (easeOutExpo)
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };

    window.addEventListener("nav-jump-to", handleNavJump);
    return () => window.removeEventListener("nav-jump-to", handleNavJump);
  }, [lenis]);
}
