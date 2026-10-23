export interface Project {
  id: string; // Уникальный ID (используется для ключа key в React)
  title: string; // Название проекта
  tags: string[]; // Массив технологий (React, TS, Three.js и т.д.)
  description: string; // Текст для модального окна

  imageUrl: string; // Обложка, которая видна в карточке проекта
  images?: string[]; // Опционально: массив фото для карусели в модалке
  videoUrl: string; // Видео-превью, которое запускается при наведении

  githubUrl?: string; // Опционально: ссылка на исходный код
  liveUrl?: string; // Опционально: ссылка на живое демо

  hasInteractiveDemo?: boolean; // Опционально: флаг, показывать ли предупреждение о тяжелой 3D-графике
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "p1",
    title: "3D-просмотрщик интерактивный",
    tags: ["React", "TS", "Three.js", "R3F"],
    description:
      "Разработка интерактивной витрины для бренда велосипедов. Пользователь может вращать 3D-модель, менять её цвет и текстуры.",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow",
    liveUrl: "https://andy-glow.github.io/react-car-threefiber-app/",
    hasInteractiveDemo: true,
  },
  {
    id: "p2",
    title: "Веб-конфигуратор мебели",
    tags: ["React", "TS", "Three.js", "R3F"],
    description:
      "Сложный конфигуратор мебели с возможностью выбора комплектации. 3D-модель оптимизирована для мобильных устройств.",
    imageUrl:
      "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow",
    hasInteractiveDemo: true,
  },
  {
    id: "p3",
    title: "Интерактивная сцена 'Корветт С7' ретровейв",
    tags: ["React", "TS", "R3F"],
    description: "3D-сцена сапортивный автомобиль Corvette C7 на виртуальном хайвее",
    imageUrl: "/pics/retrowave.jpg",
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
    imageUrl: "/pics/portal.jpg",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    githubUrl: "https://github.com/Andy-Glow/floating-portals-r3f-app",
    liveUrl: "https://andy-glow.github.io/floating-portals-r3f-app/",
    hasInteractiveDemo: true,
  },
  {
    id: "p5",
    title: "3D-модели",
    tags: ["3ds max", "Corona renderer"],
    description: "3д-модели low-poly / high-poly",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    // Замените пути на ваши из /pics/
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p6",
    title: "3D-визуализации",
    tags: ["3ds max", "Corona renderer"],
    description: "Реалистичные визуализации",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    // Замените пути на ваши из /pics/
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];
