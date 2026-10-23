import React from "react";
import { motion } from "motion/react";
import styles from "./Interface.module.scss";
import { Info } from "../sections/Info";
import { Skills } from "../sections/Skills";
import { Projects } from "../sections/Projects";
import { Contacts } from "../sections/Contacts";

// Универсальный компонент-обертка для каждой секции
function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    // data-lenis-snap — "якорь" для навигации и нативного CSS-скролла
    <div className={`${styles.sectionContainer} ${className || ""}`} data-lenis-snap>
      {/* motion.div отвечает за анимацию появления (Blur Reveal) */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} // Начальное состояние: невидим, снизу, размыт
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} // Конечное состояние: виден, на месте, четкий
        transition={{ duration: 0.8, ease: "easeOut" }} // Плавность анимации
        viewport={{ once: false, amount: 0.2 }} // once: false — анимация срабатывает при каждом проезде
        className={styles.textBlock}>
        {children}
      </motion.div>
    </div>
  );
}

export function Interface() {
  return (
    // Общая обертка для всех секций
    <div className={styles.wrapper}>
      {/* Первая секция. mobileBottom прижимает её вниз на мобильных */}
      <Section className={styles.mobileBottom}>
        <Info />
      </Section>

      {/* Остальные секции. mobileTop прижимает их к верху, чтобы не мешать меню */}
      <Section className={styles.mobileTop}>
        <Skills />
      </Section>
      <Section className={styles.mobileTop}>
        <Projects />
      </Section>
      <Section className={styles.mobileTop}>
        <Contacts />
      </Section>
    </div>
  );
}
