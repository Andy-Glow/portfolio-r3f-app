import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import styles from "./Contacts.module.scss";

const TelegramIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.87 1.19-5.3 3.5-.5.34-.95.51-1.36.5-.45-.01-1.31-.25-1.95-.46-.78-.26-1.4-.4-1.35-.85.03-.23.35-.47.96-.71 3.76-1.64 6.27-2.72 7.53-3.25 3.58-1.49 4.32-1.75 4.81-1.76.11 0 .35.03.5.15.13.1.17.24.18.35.01.08.03.21.02.36z' />
  </svg>
);

const EmailIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
    <polyline points='22,6 12,13 2,6'></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <polyline points='20 6 9 17 4 12'></polyline>
  </svg>
);

interface MagneticCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
}

function MagneticCard({ children, onClick, href, target }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const translateX = useTransform(springX, (val) => Math.max(-15, Math.min(15, val)));
  const translateY = useTransform(springY, (val) => Math.max(-15, Math.min(15, val)));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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

  if (href) {
    return (
      <a href={href} target={target} rel='noopener noreferrer' className={styles.magneticWrapper}>
        {CardContent}
      </a>
    );
  }

  return <div className={styles.magneticWrapper}>{CardContent}</div>;
}

export function Contacts() {
  const [isCopied, setIsCopied] = useState(false);
  const emailAddress = "hello@bezuglov.dev";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <>
      <h2 className='section-title'>КОНТАКТЫ</h2>
      <p>Вы можете написать мне в телеграм или на электронную почту</p>
      <div className={styles.contactsWrapper}>
        <MagneticCard href='https://t.me/your_username' target='_blank'>
          <div className={`${styles.iconWrapper} ${styles.telegram}`}>
            <TelegramIcon />
          </div>
          <div className={styles.textWrapper}>
            <span className={styles.label}>Telegram</span>
            <span className={styles.value}>@your_username</span>
          </div>
        </MagneticCard>

        <MagneticCard onClick={handleCopyEmail}>
          <div className={`${styles.iconWrapper} ${styles.email}`}>
            {isCopied ? <CheckIcon /> : <EmailIcon />}
          </div>
          <div className={styles.textWrapper}>
            <span className={styles.label}>{isCopied ? "Успешно" : "Email"}</span>
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
