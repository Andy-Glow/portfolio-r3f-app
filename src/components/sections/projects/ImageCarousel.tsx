import { useState } from "react";
import styles from "../Projects.module.scss";

interface ImageCarouselProps {
  images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  // 1. Стейт для отслеживания индекса текущей картинки (начинаем с 0)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Переключение на предыдущую картинку
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // КРИТИЧЕСКИ ВАЖНО: предотвращаем закрытие модалки при клике на стрелку
    // Если мы на первой картинке (0), переключаемся на последнюю
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // 3. Переключение на следующую картинку
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Если мы на последней картинке, переключаемся на первую
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.carousel}>
      {/* 4. Отображение текущей картинки */}
      <img src={images[currentIndex]} alt={`Фото ${currentIndex + 1}`} />

      {/* 5. Кнопки-стрелки (используем HTML-сущности для символов < и >) */}
      <button className={`${styles.carouselBtn} ${styles.prev}`} onClick={handlePrev}>
        &#8249;
      </button>
      <button className={`${styles.carouselBtn} ${styles.next}`} onClick={handleNext}>
        &#8250;
      </button>

      {/* 6. Точки-индикаторы внизу */}
      <div className={styles.carouselDots}>
        {images.map((_, i) => (
          <span
            key={i}
            // Добавляем класс activeDot только к точке, соответствующей currentIndex
            className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
