import React from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useScrollProgress } from "../../providers/ScrollProvider";

export function Office(props: React.ComponentProps<"group">) {
  // 1. Загружаем модель и текстуру с учетом базового пути (BASE_URL)
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/scene.glb`);
  const bakedTexture = useTexture(`${import.meta.env.BASE_URL}textures/baked.jpg`);

  // 2. Получаем доступ к прогрессу скролла (от 0 до 1)
  const progressRef = useScrollProgress();

  // Настройка текстуры для корректного отображения цвета
  bakedTexture.flipY = false;
  bakedTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. Создаем оптимизированный материал (не реагирует на свет, рисуется быстро)
  const bakedMaterial = React.useMemo(
    () => new THREE.MeshBasicMaterial({ map: bakedTexture }),
    [bakedTexture],
  );

  // 4. Применяем материал ко всем объектам внутри модели
  React.useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = bakedMaterial;
      }
    });
  }, [scene, bakedMaterial]);

  const groupRef = React.useRef<THREE.Group>(null);

  // 5. Анимация улетания офиса
  useFrame(() => {
    if (!groupRef.current) return;
    const progress = progressRef.current;

    // Вычисляем прогресс ТОЛЬКО для перехода с 1-го на 2-й экран (от 0 до 0.25)
    const firstScreenProgress = Math.min(progress / 0.25, 1);

    // Опускаем офис вниз и уменьшаем (lerp для плавности)
    const targetY = THREE.MathUtils.lerp(-1.0, -5.0, firstScreenProgress);
    const targetX = THREE.MathUtils.lerp(0.2, 0.2, firstScreenProgress);

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);

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

// Предзагрузка файлов с учетом базового пути
useGLTF.preload(`${import.meta.env.BASE_URL}models/scene.glb`);
useTexture.preload(`${import.meta.env.BASE_URL}textures/baked.jpg`);
