import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Projects.module.scss";

interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  imageUrl: string;
  videoUrl: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: "p1",
    title: "Интерактивная 3D-витрина",
    tags: ["React", "Three.js", "R3F"],
    description:
      "Разработка интерактивной витрины для бренда одежды. Пользователь может вращать 3D-модель, менять её цвет и текстуры.",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p2",
    title: "Веб-конфигуратор авто",
    tags: ["TypeScript", "Next.js", "Blender"],
    description:
      "Сложный конфигуратор автомобилей с возможностью выбора комплектации. 3D-модель оптимизирована для мобильных устройств.",
    imageUrl:
      "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p3",
    title: "Портфолио дизайнера",
    tags: ["Vue.js", "GSAP", "SCSS"],
    description:
      "Сайт-визитка для цифрового художника с плавными переходами между страницами и кастомным курсором.",
    imageUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p4",
    title: "Игра 'Космический шутер'",
    tags: ["Phaser.js", "Canvas", "Web Audio"],
    description: "Браузерная 2D-игра с процедурной генерацией уровней и динамическим саундтреком.",
    imageUrl:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p5",
    title: "Дашборд аналитики",
    tags: ["React", "D3.js", "Redux"],
    description:
      "Панель управления с интерактивными графиками и возможностью выгрузки отчетов в PDF.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p6",
    title: "Лендинг IT-конференции",
    tags: ["HTML/CSS", "GSAP", "Webflow"],
    description: "Одностраничный сайт с анимациями появления спикеров и интерактивным расписанием.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <motion.div
      className={styles.projectCard}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}>
      <div className={styles.mediaContainer}>
        <img src={project.imageUrl} alt={project.title} />
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          className={styles.video}
        />
      </div>
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

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <h2 className='section-title'>МОИ ПРОЕКТЫ</h2>
      <div className={styles.projectsList}>
        {PROJECTS_DATA.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}>
              <motion.div
                className={styles.modalContent}
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={() => setSelectedProject(null)}>
                  ✕
                </button>
                <h2 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>{selectedProject.title}</h2>
                <div className={styles.projectTags} style={{ marginBottom: "20px" }}>
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.modalMedia}>
                  <img src={selectedProject.imageUrl} alt={selectedProject.title} />
                </div>
                <p className={styles.modalDescription}>
                  {selectedProject.description}
                  <br />
                  <br />
                  <em>(Здесь позже появится ссылка на GitHub и живое демо проекта)</em>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
