import { motion } from "motion/react";
import styles from "./Info.module.scss";

export function Info() {
  return (
    <motion.div
      className={styles.infoCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}>
      <h1 className='main-title'>Безуглов Андрей</h1>
      <div>
        <p className='subtitle'>Разработчик React / TS / Three.js / Node.js</p>
        <p className='subtitle'>3д-визуализатор / 3д-моделер</p>
      </div>
      <div style={{ marginTop: "10px" }}>
        <p className={styles.roleTitle}>Создаю:</p>
        <ul className={styles.roleList}>
          <li>Интерактивные 3д-приложения</li>
          <li>Сайты / Конфигураторы / Лендинги</li>
          <li>3д-модели low-poly / high-poly</li>
          <li>Реалистичные 3д-визуализации</li>
        </ul>
      </div>
    </motion.div>
  );
}
