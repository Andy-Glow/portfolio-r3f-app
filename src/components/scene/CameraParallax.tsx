import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface CameraParallaxProps {
  intensity?: number; // Сила эффекта
  lookAtY?: number; // Высота точки, на которую смотрит камера
}

export function CameraParallax({ intensity = 0.15, lookAtY = 0 }: CameraParallaxProps) {
  const { camera, pointer } = useThree();
  const initialPosition = useRef(camera.position.clone());

  useFrame((_state, delta) => {
    const targetX = initialPosition.current.x + pointer.x * intensity;
    const targetY = initialPosition.current.y + pointer.y * intensity * 0.6;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.0, delta);

    // ТЕПЕРЬ КАМЕРА СМОТРИТ НА НУЖНУЮ ВЫСОТУ
    // Если поставить 0, она будет смотреть вниз, как раньше.
    camera.lookAt(0, lookAtY, 0);
  });

  return null;
}
