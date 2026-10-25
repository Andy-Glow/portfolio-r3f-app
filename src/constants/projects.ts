export interface Project {
  id: string; // Уникальный ID
  title: string; // Название проекта
  tags: string[]; // Массив технологий
  description: string; // Текст для модального окна
  imageUrl: string; // Обложка для карточки
  images?: string[]; // Опционально: массив фото для карусели
  videoUrl: string; // Видео-превью при наведении
  githubUrl?: string; // Опционально: ссылка на GitHub
  liveUrl?: string; // Опционально: ссылка на живое демо
  hasInteractiveDemo?: boolean; // Опционально: показывать предупреждение о 3D
}

// Базовый путь для корректной загрузки картинок из папки public
const BASE = import.meta.env.BASE_URL;

export const PROJECTS_DATA: Project[] = [
  // ... (первые два проекта без изменений, если там ссылки на unsplash)
  {
    id: "p3",
    title: "Интерактивная сцена 'Корветт С7' ретровейв",
    tags: ["React", "TS", "R3F"],
    description: "3D-сцена сапортивный автомобиль Corvette C7 на виртуальном хайвее",
    imageUrl: `${BASE}pics/retrowave.jpg`, // Используем BASE для локальных картинок
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow/react-car-threefiber-app",
    liveUrl: "https://andy-glow.github.io/react-car-threefiber-app/",
    hasInteractiveDemo: true,
  },
  {
    id: "p4",
    title: "Сцена 'Портал'",
    tags: ["React", "TS", "R3F"],
    description:
      "Интерактивная трехмерная WebGL диорама парящего космического острова с кинематографичным эффектом 3D-портала.",
    imageUrl: `${BASE}pics/portal.jpg`, // Используем BASE
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow/floating-portals-r3f-app",
    liveUrl: "https://andy-glow.github.io/floating-portals-r3f-app/",
    hasInteractiveDemo: true,
  },
  // ... остальные проекты аналогично (если есть локальные картинки, добавьте ${BASE} в начале пути)
];
