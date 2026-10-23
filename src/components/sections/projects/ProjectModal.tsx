import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import styles from "../Projects.module.scss";
import type { Project } from "../../../constants/projects";
import { ImageCarousel } from "./ImageCarousel";

interface ProjectModalProps {
  project: Project | null; // Данные выбранного проекта или null (если закрыто)
  onClose: () => void; // Функция для закрытия окна
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const lenis = useLenis();

  // 1. ЭФФЕКТ: Блокировка скролла при открытом окне
  useEffect(() => {
    if (project) {
      lenis?.stop(); // Останавливаем плавный скролл (Lenis)
      document.body.style.overflow = "hidden"; // Отключаем нативный скролл браузера
    } else {
      lenis?.start(); // Возобновляем скролл
      document.body.style.overflow = ""; // Возвращаем нативный скролл
    }
    // Очистка: если компонент размонтируется (например, при переходе на другую страницу),
    // скролл должен вернуться в рабочее состояние.
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [project, lenis]);

  // 2. ПОРТАЛ: Телепортируем модалку в конец <body>
  return createPortal(
    // 3. AnimatePresence: Позволяет анимации закрытия (exit) отработать перед удалением из DOM
    <AnimatePresence>
      {project && (
        // 4. ОВЕРЛЕЙ: Темный фон, клик по которому закрывает модалку
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}>
          {/* 5. КОНТЕНТ: Само белое/темное окно с информацией */}
          <motion.div
            className={styles.modalContent}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // КРИТИЧЕСКИ ВАЖНО: останавливаем всплытие клика, чтобы клик внутри окна не закрывал его
            onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>

            {/* Рендерим данные проекта */}
            <h2 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>{project.title}</h2>

            <div className={styles.projectTags} style={{ marginBottom: "20px" }}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className={styles.modalMedia}>
              {/* Если есть массив картинок, показываем карусель, иначе одну картинку */}
              {project.images ? (
                <ImageCarousel images={project.images} />
              ) : (
                <img src={project.imageUrl} alt={project.title} />
              )}
            </div>

            <p className={styles.modalDescription}>{project.description}</p>

            {/* Условный рендеринг предупреждения */}
            {project.hasInteractiveDemo && (
              <div className={styles.modalWarning}>
                <p className={styles.warningText}>
                  ⚠️ Обратите внимание: живые демо-версии используют тяжелую 3D-графику (WebGL).
                  Открытие нескольких таких вкладок одновременно может нагрузить ваше устройство.
                </p>
              </div>
            )}

            <div className={styles.modalLinks}>
              {/* Условный рендеринг ссылок (если ссылки нет, кнопка не появится) */}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.linkBtn}>
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.linkBtn}>
                  Живое демо
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body, // <-- Куда телепортируем
  );
}
