import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Loader.module.scss";

export function Loader() {
  const { active } = useProgress();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  // Флаг "загрузка хоть раз начиналась" — защита от кеша
  const hasStartedRef = useRef(false);
  // Флаг "загрузка действительно закончена" (после debounce)
  const doneRef = useRef(false);

  // 1. Отслеживаем старт и окончание загрузки (с защитой от мигания)
  useEffect(() => {
    if (active) {
      hasStartedRef.current = true;
      doneRef.current = false;
    } else if (hasStartedRef.current) {
      // Ждем 300мс тишины, прежде чем считать загрузку завершенной
      const timer = setTimeout(() => {
        doneRef.current = true;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [active]);

  // 2. Анимация прогресса (монотонная, никогда не идет назад)
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        if (!hasStartedRef.current) return prev; // Еще не началось

        if (doneRef.current) {
          // Загрузка завершена — быстро добиваем до 100
          return Math.min(prev + 8, 100);
        }
        // Идет загрузка — медленно ползем к 90%
        return Math.min(prev + Math.random() * 2 + 1, 90);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [visible]);

  // 3. Условия для скрытия лоадера
  useEffect(() => {
    if (!visible) return;

    // Если за 800мс так ничего и не загрузилось (всё из кеша) — скрываем
    if (!hasStartedRef.current) {
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }

    // Если прогресс дошел до 100% и загрузка завершена — скрываем
    if (progress >= 100 && doneRef.current) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [progress, visible]);

  const handleExitComplete = () => {
    window.dispatchEvent(new Event("loader-exited"));
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}>
          <div className={styles.loaderContent}>
            <h2 className={styles.title}>Загрузка 3D-сцены</h2>
            <div className={styles.progressBarBg}>
              <motion.div
                className={styles.progressBarFill}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
            <span className={styles.percent}>{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
