import React from "react";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

// Исключаем свойство "object" из пропсов с помощью утилиты Omit
type AvatarModelProps = Omit<React.ComponentProps<"primitive">, "object">;

export function AvatarModel(props: AvatarModelProps) {
  const { scene } = useGLTF("/models/my-avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);

  React.useLayoutEffect(() => {
    clone.traverse((obj) => {
      if (obj.isObject3D) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
  }, [clone]);

  // Передаем object, а затем остальные пропсы (если они есть)
  return <primitive object={clone} {...props} />;
}

useGLTF.preload("/models/my-avatar.glb");
