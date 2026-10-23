import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import styles from "./Contacts.module.scss";
import { TelegramIcon, EmailIcon, CheckIcon } from "../ui/Icons"; // 1. Импортируем иконки

interface MagneticCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
}

// 2. Компонент карточки с эффектом "магнита"
function MagneticCard({ children, onClick, href, target }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Создаем реактивные значения для координат смещения
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Настраиваем физику пружины для плавного возврата
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Ограничиваем максимальное смещение карточки (макс 15px)
  const translateX = useTransform(springX, (val) => Math.max(-15, Math.min(15, val)));
  const translateY = useTransform(springY, (val) => Math.max(-15, Math.min(15, val)));

  // 3. Вычисляем смещение мыши относительно центра карточки
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Коэффициент 0.4 регулирует силу притяжения
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  // Возвращаем карточку в исходное положение
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Контент карточки (обертка motion.div для анимаций)
  const CardContent = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: translateX, y: translateY }}
      className={styles.card}>
      {children}
    </motion.div>
  );

  // Если передан href, делаем карточку ссылкой, иначе обычным div
  if (href) {
    return (
      <a href={href} target={target} rel='noopener noreferrer' className={styles.magneticWrapper}>
        {CardContent}
      </a>
    );
  }

  return <div className={styles.magneticWrapper}>{CardContent}</div>;
}

// 4. Главный компонент секции
export function Contacts() {
  // Стейт для отслеживания состояния "Скопировано"
  const [isCopied, setIsCopied] = useState(false);
  const emailAddress = "golding@yandex.ru";

  // 5. Функция копирования почты в буфер обмена
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      setIsCopied(true);
      // Возвращаем исходный вид через 3 секунды
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <>
      <h2 className='section-title'>КОНТАКТЫ</h2>
      <p>Вы можете написать мне в телеграм или на электронную почту</p>

      <div className={styles.contactsWrapper}>
        {/* Карточка Telegram (ссылка) */}
        <MagneticCard href='https://t.me/andy_b_glow' target='_blank'>
          <div className={`${styles.iconWrapper} ${styles.telegram}`}>
            <TelegramIcon />
          </div>
          <div className={styles.textWrapper}>
            <span className={styles.label}>Telegram</span>
            <span className={styles.value}>@andy_b_glow</span>
          </div>
        </MagneticCard>

        {/* Карточка Email (с копированием) */}
        <MagneticCard onClick={handleCopyEmail}>
          <div className={`${styles.iconWrapper} ${styles.email}`}>
            {/* Условный рендеринг иконки */}
            {isCopied ? <CheckIcon /> : <EmailIcon />}
          </div>
          <div className={styles.textWrapper}>
            <span className={styles.label}>{isCopied ? "Успешно" : "Email"}</span>

            {/* Условный рендеринг текста */}
            {isCopied ? (
              <span className={styles.copiedState}>Скопировано!</span>
            ) : (
              <span className={styles.value}>{emailAddress}</span>
            )}
          </div>
        </MagneticCard>
      </div>
    </>
  );
}
