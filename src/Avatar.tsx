import React from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export interface AvatarProps extends React.ComponentProps<"group"> {
  animation?: string;
}

export function Avatar({ animation = "typing", ...props }: AvatarProps) {
  const { scene } = useGLTF("/models/my-avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as any;

  // 1. Загружаем все три файла анимаций, созданных через Blender
  const { animations: typingClips } = useGLTF("/animations/typing.glb");
  const { animations: standingClips } = useGLTF("/animations/standing.glb");
  const { animations: fallingClips } = useGLTF("/animations/falling.glb");

  // 2. Принудительно даем каждому первому треку уникальное имя
  if (typingClips && typingClips[0]) typingClips[0].name = "typing";
  if (standingClips && standingClips[0]) standingClips[0].name = "standing";
  if (fallingClips && fallingClips[0]) fallingClips[0].name = "falling";

  const groupRef = React.useRef<THREE.Group>(null);

  // 3. Собираем все клипы в один единый массив для анимационного миксера
  const allAnimations = React.useMemo(() => {
    return [...(typingClips || []), ...(standingClips || []), ...(fallingClips || [])];
  }, [typingClips, standingClips, fallingClips]);

  const { actions } = useAnimations(allAnimations, groupRef);

  // 4. Эффект плавного переключения анимаций (Таймкод: 07:15)
  React.useEffect(() => {
    const currentAction = actions[animation];
    if (currentAction) {
      // reset сбрасывает на 0 кадр, fadeIn плавно смешивает текущую анимацию со следующей за 0.5 сек
      currentAction.reset().fadeIn(0.5).play();
    }
    // Cleanup-функция автоматически гасит прошлую анимацию при смене пропса
    return () => {
      if (currentAction) currentAction.fadeOut(0.5);
    };
  }, [animation, actions]);

  // Поворот головы мышкой
  useFrame((state) => {
    if (nodes.Neck && nodes.Head) {
      const targetX = state.pointer.x * 1.8;
      const targetY = -state.pointer.y * 1.1;

      nodes.Neck.rotation.y = THREE.MathUtils.lerp(nodes.Neck.rotation.y, targetX * 0.3, 0.1);
      nodes.Neck.rotation.x = THREE.MathUtils.lerp(nodes.Neck.rotation.x, targetY * 0.3, 0.1);

      if (nodes.Neck1) {
        nodes.Neck1.rotation.y = THREE.MathUtils.lerp(nodes.Neck1.rotation.y, targetX * 0.3, 0.1);
        nodes.Neck1.rotation.x = THREE.MathUtils.lerp(nodes.Neck1.rotation.x, targetY * 0.3, 0.1);
      }

      nodes.Head.rotation.y = THREE.MathUtils.lerp(nodes.Head.rotation.y, targetX * 0.7, 0.1);
      nodes.Head.rotation.x = THREE.MathUtils.lerp(nodes.Head.rotation.x, targetY * 0.7, 0.1);
    }
  });

  React.useLayoutEffect(() => {
    clone.traverse((obj) => {
      if (obj.isObject3D) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [clone]);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/models/my-avatar.glb");
useGLTF.preload("/animations/typing.glb");
useGLTF.preload("/animations/standing.glb");
useGLTF.preload("/animations/falling.glb");
