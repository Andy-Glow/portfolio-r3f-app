import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import styles from "./Skills.module.scss";

interface SkillCardProps {
  label: string;
  value: number;
}

function SkillCard({ label, value }: SkillCardProps) {
  // 1. Стейт для отслеживания наведения мыши
  const [isHovered, setIsHovered] = useState(false);

  // 2. "Движок" анимации счетчика и полоски
  const motionVal = useMotionValue(0); // Текущее значение (от 0 до 100)
  const spring = useSpring(motionVal, { damping: 20, stiffness: 120 }); // Пружина для плавности

  // 3. Преобразования для визуальной части
  const displayVal = useTransform(spring, (v) => `${Math.round(v)}%`); // Для текста с процентами
  const scaleX = useTransform(spring, [0, 100], [0, 1]); // Для ширины полоски (от 0 до 1)

  // Стейт для отображения текста
  const [displayText, setDisplayText] = useState("0%");

  // 4. Синхронизация "пружины" с текстом
  useEffect(() => {
    const unsub = displayVal.on("change", (v) => setDisplayText(v));
    return unsub;
  }, [displayVal]);

  // 5. Обработчики мыши
  const handleMouseEnter = () => {
    setIsHovered(true);
    motionVal.set(0); // Сбрасываем в ноль
    setTimeout(() => motionVal.set(value), 50); // Через 50мс запускаем заполнение
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    motionVal.set(0); // Сбрасываем при уходе
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.card}
      whileHover={{ y: -4, scale: 1.02 }} // Легкий подъем при наведении
      whileTap={{ scale: 0.98 }}>
      <div className={styles.content}>
        <p className={styles.name}>{label}</p>

        {/* 6. Блок с полоской и процентами (появляется только при наведении) */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0,
            marginTop: isHovered ? "6px" : 0,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}>
          <div className={styles.progressBg}>
            <motion.div className={styles.progressFill} style={{ scaleX, originX: 0 }} />
          </div>
          <span className={styles.percent}>{displayText}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <>
      <h2 className='section-title'>МОИ НАВЫКИ</h2>
      <div className={styles.grid}>
        <SkillCard label='React' value={90} />
        <SkillCard label='TypeScript' value={80} />
        <SkillCard label='Three.js / WebGL / R3F' value={80} />
        <SkillCard label='HTML / CSS / JS' value={90} />
        <SkillCard label='3ds max / Corona Renderer' value={90} />
        <SkillCard label='Blender' value={60} />
        <SkillCard label='Unreal Engine 5' value={55} />
        <SkillCard label='Photoshop' value={75} />
        <SkillCard label='Английский язык' value={85} />
      </div>
    </>
  );
}
