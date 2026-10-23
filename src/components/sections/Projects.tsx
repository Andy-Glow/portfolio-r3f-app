import { useState } from "react";
import styles from "./Projects.module.scss";
import { PROJECTS_DATA, type Project } from "../../constants/projects"; // Импортируем вынесенные компоненты
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectModal } from "./projects/ProjectModal";

export function Projects() {
  // 1. Единственный стейт, который хранит выбранный проект (или null, если модалка закрыта)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <h2 className='section-title'>МОИ ПРОЕКТЫ</h2>

      {/* 2. Сетка карточек. Проходимся по данным и рендерим карточки */}
      <div className={styles.projectsList}>
        {PROJECTS_DATA.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)} // При клике передаем проект в стейт
          />
        ))}
      </div>

      {/* 3. Модальное окно. Рендерится вне сетки, получает данные и функцию закрытия */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}
