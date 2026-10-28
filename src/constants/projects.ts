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
  {
    id: "p1",
    title: "3D-просмотрщик интерактивный",
    tags: ["React", "TS", "Three.js", "Next.js"],
    description:
      "Разработка интерактивной витрины для бренда велосипедов. Пользователь может вращать 3D-модель, менять её цвет и текстуры.",
    imageUrl: `${BASE}pics/bicycles.jpg`,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow/bike-configurator-app",
    liveUrl: "https://andy-glow.github.io/bike-configurator-app/",
    hasInteractiveDemo: true,
  },
  {
    id: "p2",
    title: "Веб-конфигуратор мебели",
    tags: ["React", "TS", "Three.js", "R3F"],
    description:
      "Сложный конфигуратор мебели с возможностью выбора комплектации. 3D-модель оптимизирована для мобильных устройств. (ПРОЕКТ В РАЗРАБОТКЕ!)",
    imageUrl: `${BASE}pics/under-development.png`,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow",
    hasInteractiveDemo: true,
  },
  {
    id: "p3",
    title: "Интерактивная сцена 'Корветт С7' ретровейв",
    tags: ["React", "TS", "R3F"],
    description: "3D-сцена сапортивный автомобиль Corvette C7 на виртуальном хайвее",
    imageUrl: `${BASE}pics/retrowave.jpg`, // Локальная картинка
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
    imageUrl: `${BASE}pics/portal.jpg`, // Локальная картинка
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow/floating-portals-r3f-app",
    liveUrl: "https://andy-glow.github.io/floating-portals-r3f-app/",
    hasInteractiveDemo: true,
  },
  {
    id: "p5",
    title: "3D-модели",
    tags: ["3ds max", "Corona renderer"],
    description: "3д-модели low-poly / high-poly (ПРОЕКТ В РАЗРАБОТКЕ!)",
    imageUrl: `${BASE}pics/under-development.png`,
    images: [
      `${BASE}pics/under-development.png`,
      `${BASE}pics/under-development.png`,
      `${BASE}pics/under-development.png`,
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p6",
    title: "3D-визуализации",
    tags: ["3ds max", "Corona renderer"],
    description: "Реалистичные визуализации",
    imageUrl: `${BASE}pics/works/renders/savannah.jpg`,
    images: [
      `${BASE}pics/works/renders/aquarium.jpg`,
      `${BASE}pics/works/renders/flat.jpg`,
      `${BASE}pics/works/renders/house1.jpg`,
      `${BASE}pics/works/renders/house2.jpg`,
      `${BASE}pics/works/renders/house3.jpg`,
      `${BASE}pics/works/renders/kitchen.jpg`,
      `${BASE}pics/works/renders/kitchen1.jpg`,
      `${BASE}pics/works/renders/kitchen2.jpg`,
      `${BASE}pics/works/renders/savannah.jpg`,
      `${BASE}pics/works/renders/stool.jpg`,
      `${BASE}pics/works/renders/tokyo.jpg`,
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];
