import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import styles from "./Interface.module.scss";
import { Info } from "../sections/Info";
import { Skills } from "../sections/Skills";
import { Projects } from "../sections/Projects";
import { Contacts } from "../sections/Contacts";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  forceVisible?: boolean; // Пропс для ручного управления видимостью
}

// Универсальный компонент-обертка для каждой секции
function Section({ children, className, forceVisible }: SectionProps) {
  // Проверяем, управляется ли видимость этой секции вручную (только для первой)
  const isControlled = forceVisible !== undefined;

  return (
    // data-lenis-snap — "якорь" для навигации и нативного CSS-скролла
    <div className={`${styles.sectionContainer} ${className || ""}`} data-lenis-snap>
      {/* motion.div отвечает за анимацию появления (Blur Reveal) */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} // Начальное состояние: невидим, снизу, размыт
        // Если секция НЕ управляется вручную, используем стандартный скролл-триггер
        whileInView={isControlled ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
        // Если секция управляется вручную (первая), ждем сигнала от лоадера
        animate={
          isControlled
            ? {
                opacity: forceVisible ? 1 : 0,
                y: forceVisible ? 0 : 40,
                filter: forceVisible ? "blur(0px)" : "blur(12px)",
              }
            : undefined
        }
        transition={{ duration: 0.8, ease: "easeOut" }} // Плавность анимации
        // Отключаем стандартный триггер для управляемой секции
        viewport={isControlled ? undefined : { once: false, amount: 0.2 }}
        className={styles.textBlock}>
        {children}
      </motion.div>
    </div>
  );
}

export function Interface() {
  // Стейт для управления появлением первого блока (Info)
  const [isFirstSectionReady, setIsFirstSectionReady] = useState(false);

  useEffect(() => {
    // Слушаем событие, которое отправляет компонент Loader после своего исчезновения
    const handleLoaderExited = () => {
      // Как только лоадер рассеялся, ждем 100 мс
      setTimeout(() => {
        setIsFirstSectionReady(true);
      }, 100);
    };

    window.addEventListener("loader-exited", handleLoaderExited);
    return () => window.removeEventListener("loader-exited", handleLoaderExited);
  }, []);

  return (
    // Общая обертка для всех секций
    <div className={styles.wrapper}>
      {/* Первая секция. Передаем forceVisible, чтобы она ждала лоадер. mobileBottom прижимает её вниз на мобильных */}
      <Section className={styles.mobileBottom} forceVisible={isFirstSectionReady}>
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
