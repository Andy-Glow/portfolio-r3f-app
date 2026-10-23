import React from "react";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

// Исключаем свойство "object" из пропсов, так как мы передаем его сами внутри компонента
type AvatarModelProps = Omit<React.ComponentProps<"primitive">, "object">;

export function AvatarModel(props: AvatarModelProps) {
  // 1. Загружаем оригинальную 3D-модель Аватара
  const { scene } = useGLTF("/models/my-avatar.glb");

  // 2. Клонируем модель (ОБЯЗАТЕЛЬНО через SkeletonUtils для анимированных моделей)
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

  // 4. Рендерим готовый Three.js объект в сцене (с пробросом остальных пропсов)
  return <primitive object={clone} {...props} />;
}

// 5. Предзагрузка модели, чтобы она скачалась до того, как понадобится
useGLTF.preload("/models/my-avatar.glb");
