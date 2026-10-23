import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import styles from "./Projects.module.scss";
import { PROJECTS_DATA, type Project } from "../../constants/projects";

function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  return (
    <div className={styles.carousel}>
      <img src={images[currentIndex]} alt={`Фото ${currentIndex + 1}`} />
      <button className={`${styles.carouselBtn} ${styles.prev}`} onClick={handlePrev}>
        &#8249;
      </button>
      <button className={`${styles.carouselBtn} ${styles.next}`} onClick={handleNext}>
        &#8250;
      </button>
      <div className={styles.carouselDots}>
        {images.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ""}`} />
        ))}
      </div>
    </div>
  );
}

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
  const lenis = useLenis();

  useEffect(() => {
    if (selectedProject) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [selectedProject, lenis]);

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
                  {selectedProject.images ? (
                    <ImageCarousel images={selectedProject.images} />
                  ) : (
                    <img src={selectedProject.imageUrl} alt={selectedProject.title} />
                  )}
                </div>
                <p className={styles.modalDescription}>{selectedProject.description}</p>
                {selectedProject.hasInteractiveDemo && (
                  <div className={styles.modalWarning}>
                    <p className={styles.warningText}>
                      ⚠️ Обратите внимание: живые демо-версии используют тяжелую 3D-графику (WebGL).
                      Открытие нескольких таких вкладок одновременно может нагрузить ваше
                      устройство.
                    </p>
                  </div>
                )}
                <div className={styles.modalLinks}>
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.linkBtn}>
                      GitHub
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
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
        document.body,
      )}
    </>
  );
}
