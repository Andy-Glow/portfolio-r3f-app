import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface CameraParallaxProps {
  intensity?: number; // Сила смещения камеры
  lookAtY?: number; // Высота точки, на которую смотрит камера
}

export function CameraParallax({ intensity = 0.15, lookAtY = 0 }: CameraParallaxProps) {
  // Достаем текущую камеру из R3F
  const { camera } = useThree();

  // Запоминаем начальную позицию камеры (чтобы было куда возвращаться)
  const initialPosition = useRef(camera.position.clone());

  // Создаем локальный ref для хранения позиции мыши (-1 до 1)
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Слушаем движение мыши глобально на window (так как HTML-слой перекрывает Canvas)
    const handleMouseMove = (e: MouseEvent) => {
      // Преобразуем координаты экрана (0...W, 0...H) в диапазон (-1...1)
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // Инвертируем Y
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    // Вычисляем целевую позицию камеры на основе мыши
    const targetX = initialPosition.current.x + mouse.current.x * intensity;
    const targetY = initialPosition.current.y + mouse.current.y * intensity * 0.6; // По Y эффект слабее

    // Плавно (damped) двигаем камеру к цели. delta делает движение независимым от FPS
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.0, delta);

    // Камера продолжает смотреть на Аватара (или указанную высоту)
    camera.lookAt(0, lookAtY, 0);
  });

  return null; // Компонент не рендерит видимых объектов
}
