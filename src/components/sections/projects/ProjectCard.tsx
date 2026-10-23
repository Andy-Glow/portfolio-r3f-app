import { useRef } from "react";
import { motion } from "motion/react";
import styles from "../Projects.module.scss";
import type { Project } from "../../../constants/projects";

interface ProjectCardProps {
  project: Project; // Данные конкретного проекта
  onClick: () => void; // Функция для открытия модалки
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  // 1. Ссылка на HTML-элемент <video>, чтобы управлять воспроизведением
  const videoRef = useRef<HTMLVideoElement>(null);

  // 2. Логика при наведении мыши
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Сбрасываем видео в самое начало
      // Пытаемся запустить. .catch() нужен, так как браузеры иногда блокируют автоплей
      videoRef.current.play().catch(() => {});
    }
  };

  // 3. Логика при уходе мыши
  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause(); // Ставим на паузу
  };

  return (
    <motion.div
      className={styles.projectCard}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }} // При наведении карточка всплывает на 4px
      whileTap={{ scale: 0.98 }} // При клике карточка слегка сжимается
    >
      <div className={styles.mediaContainer}>
        {/* 4. Статичная обложка (видна всегда, пока не запущено видео) */}
        <img src={project.imageUrl} alt={project.title} />

        {/* 5. Видео-превью (по умолчанию скрыто через opacity: 0 в CSS) */}
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted // Обязательно для автоплея в браузерах
          loop // Зацикливаем видео
          playsInline // Запрещаем разворачиваться на весь экран на iOS
          className={styles.video}
        />
      </div>

      {/* 6. Информационный блок (Название и теги) */}
      <div className={styles.projectInfo}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <div className={styles.projectTags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
