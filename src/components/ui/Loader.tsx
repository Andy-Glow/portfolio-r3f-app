import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Loader.module.scss";

export function Loader() {
  const { progress, active } = useProgress();

  // Когда лоадер полностью исчезнет, сообщаем приложению, что можно показывать контент
  const handleExitComplete = () => {
    window.dispatchEvent(new Event("loader-exited"));
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {active && (
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
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
            <span className={styles.percent}>{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
