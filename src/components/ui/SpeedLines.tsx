import { useEffect, useState } from "react";
import styles from "./SpeedLines.module.scss";

export function SpeedLines() {
  // 1. Стейт для включения/выключения эффекта
  const [isActive, setIsActive] = useState(false);

  // 2. Подписываемся на события прыжка персонажа
  useEffect(() => {
    const handleJumpStart = () => setIsActive(true);
    const handleJumpEnd = () => setIsActive(false);

    // Слушаем кастомные события, которые отправляет хук анимации Аватара
    window.addEventListener("avatar-jump-start", handleJumpStart);
    window.addEventListener("avatar-jump-end", handleJumpEnd);

    // Очистка: отписываемся при размонтировании
    return () => {
      window.removeEventListener("avatar-jump-start", handleJumpStart);
      window.removeEventListener("avatar-jump-end", handleJumpEnd);
    };
  }, []);

  return (
    // 3. Оверлей поверх всего экрана. Класс active добавляется при прыжке
    <div className={`${styles.speedOverlay} ${isActive ? styles.active : ""}`}>
      <div className={styles.linesLayer} />
    </div>
  );
}
