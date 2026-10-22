import { useEffect, useState } from "react";
import styles from "./SpeedLines.module.scss";

export function SpeedLines() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleJumpStart = () => setIsActive(true);
    const handleJumpEnd = () => setIsActive(false);

    window.addEventListener("avatar-jump-start", handleJumpStart);
    window.addEventListener("avatar-jump-end", handleJumpEnd);

    return () => {
      window.removeEventListener("avatar-jump-start", handleJumpStart);
      window.removeEventListener("avatar-jump-end", handleJumpEnd);
    };
  }, []);

  return (
    <div className={`${styles.speedOverlay} ${isActive ? styles.active : ""}`}>
      <div className={styles.linesLayer} />
    </div>
  );
}
