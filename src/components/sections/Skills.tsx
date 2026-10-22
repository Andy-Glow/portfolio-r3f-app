import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import styles from "./Skills.module.scss";

interface SkillCardProps {
  label: string;
  value: number;
}

function SkillCard({ label, value }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 20, stiffness: 120 });
  const displayVal = useTransform(spring, (v) => `${Math.round(v)}%`);
  const [displayText, setDisplayText] = useState("0%");
  const scaleX = useTransform(spring, [0, 100], [0, 1]);

  useEffect(() => {
    const unsub = displayVal.on("change", (v) => setDisplayText(v));
    return unsub;
  }, [displayVal]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    motionVal.set(0);
    setTimeout(() => motionVal.set(value), 50);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    motionVal.set(0);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.card}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <div className={styles.content}>
        <p className={styles.name}>{label}</p>
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
        <SkillCard label='HTML / SCSS' value={95} />
        <SkillCard label='3ds max / Corona Renderer' value={90} />
        <SkillCard label='Blender' value={60} />
        <SkillCard label='Unreal Engine 5' value={55} />
      </div>
    </>
  );
}
