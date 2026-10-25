import React from "react";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

// Исключаем свойство "object" из пропсов
type AvatarModelProps = Omit<React.ComponentProps<"primitive">, "object">;

export function AvatarModel(props: AvatarModelProps) {
  // 1. Загружаем модель с учетом BASE_URL
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/my-avatar.glb`);

  // 2. Клонируем модель (ОБЯЗАТЕЛЬНО через SkeletonUtils для анимаций)
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // 3. Отключаем тени на всех дочерних объектах для оптимизации
  React.useLayoutEffect(() => {
    clone.traverse((obj) => {
      if (obj.isObject3D) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
  }, [clone]);

  // 4. Рендерим готовый Three.js объект
  return <primitive object={clone} {...props} />;
}

// Предзагрузка модели с учетом BASE_URL
useGLTF.preload(`${import.meta.env.BASE_URL}models/my-avatar.glb`);
