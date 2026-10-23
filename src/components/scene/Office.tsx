import React from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useScrollProgress } from "../../providers/ScrollProvider";

export function Office(props: React.ComponentProps<"group">) {
  // 1. Загружаем 3D-модель офиса и запеченную текстуру
  const { scene } = useGLTF("/models/scene.glb");
  const bakedTexture = useTexture("/textures/baked.jpg");

  // 2. Получаем доступ к прогрессу скролла (от 0 до 1) для синхронизации движения
  const progressRef = useScrollProgress();

  // 3. Настройка текстуры для корректного отображения цвета
  bakedTexture.flipY = false; // Отключаем переворот по Y (стандарт для GLTF)
  bakedTexture.colorSpace = THREE.SRGBColorSpace; // Правильный цветовой профиль

  // 4. Создаем оптимизированный материал (MeshBasicMaterial не реагирует на свет, рисуется очень быстро)
  const bakedMaterial = React.useMemo(
    () => new THREE.MeshBasicMaterial({ map: bakedTexture }),
    [bakedTexture],
  );

  // 5. Применяем этот материал ко ВСЕМ объектам внутри 3D-модели офиса
  React.useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = bakedMaterial;
      }
    });
  }, [scene, bakedMaterial]);

  const groupRef = React.useRef<THREE.Group>(null);

  // 6. Анимация улетания офиса в зависимости от скролла
  useFrame(() => {
    if (!groupRef.current) return;
    const progress = progressRef.current;

    // Вычисляем прогресс ТОЛЬКО для перехода с 1-го на 2-й экран (от 0 до 0.25)
    const firstScreenProgress = Math.min(progress / 0.25, 1);

    // Улетание вниз по Y
    const targetY = THREE.MathUtils.lerp(-1.0, -5.0, firstScreenProgress);
    const targetX = THREE.MathUtils.lerp(0.2, 0.2, firstScreenProgress);

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);

    // Уменьшение (сжатие) комнаты до нуля
    const targetScale = THREE.MathUtils.lerp(0.75, 0, firstScreenProgress);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1),
    );
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// 7. Предзагрузка файлов, чтобы они были готовы к моменту рендера
useGLTF.preload("/models/scene.glb");
useTexture.preload("/textures/baked.jpg");
