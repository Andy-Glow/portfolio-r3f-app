import React from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAvatarAnimation } from "../../hooks/useAvatarAnimation";
import {
  AVATAR_POSITIONS,
  AVATAR_POSITIONS_MOBILE,
  AVATAR_ROTATIONS,
} from "../../constants/avatar";
import { AvatarModel } from "./AvatarModel";

export interface AvatarProps extends React.ComponentProps<"group"> {}

export function Avatar({ ...props }: AvatarProps) {
  // 1. Загружаем все анимации с учетом BASE_URL
  const { animations: typingClips } = useGLTF(`${import.meta.env.BASE_URL}animations/typing.glb`);
  const { animations: standingClips } = useGLTF(
    `${import.meta.env.BASE_URL}animations/standing.glb`,
  );
  const { animations: jumpingClips } = useGLTF(`${import.meta.env.BASE_URL}animations/jump-v2.glb`);
  const { animations: wavingClips } = useGLTF(`${import.meta.env.BASE_URL}animations/waving.glb`);
  const { animations: saluteClips } = useGLTF(`${import.meta.env.BASE_URL}animations/salute.glb`);
  const { animations: thumbsClips } = useGLTF(`${import.meta.env.BASE_URL}animations/thumbs.glb`);

  // 2. Стандартизируем имена клипов
  if (typingClips?.[0]) typingClips[0].name = "typing";
  if (standingClips?.[0]) standingClips[0].name = "standing";
  if (jumpingClips?.[0]) jumpingClips[0].name = "jumping";
  if (wavingClips?.[0]) wavingClips[0].name = "waving";
  if (saluteClips?.[0]) saluteClips[0].name = "salute";
  if (thumbsClips?.[0]) thumbsClips[0].name = "thumbs";

  const groupRef = React.useRef<THREE.Group>(null);
  const offsetGroupRef = React.useRef<THREE.Group>(null);

  // 3. Собираем все анимации в один массив
  const allAnimations = React.useMemo(
    () => [
      ...(typingClips || []),
      ...(standingClips || []),
      ...(jumpingClips || []),
      ...(wavingClips || []),
      ...(saluteClips || []),
      ...(thumbsClips || []),
    ],
    [typingClips, standingClips, jumpingClips, wavingClips, saluteClips, thumbsClips],
  );

  // 4. Инициализируем экшены анимаций
  const { actions, mixer } = useAnimations(allAnimations, groupRef) as {
    actions: Record<string, THREE.AnimationAction>;
    mixer: THREE.AnimationMixer;
  };

  // 5. Получаем текущую анимацию из кастомного хука
  const currentAnim = useAvatarAnimation(actions, mixer);

  useFrame(() => {
    // 6. Смещение для стула (только когда печатает)
    if (offsetGroupRef.current) {
      const isTyping = currentAnim === "typing";
      const targetX = isTyping ? 0.2 : 0;
      const targetY = isTyping ? 0.7 : 0;
      const targetZ = isTyping ? 0.4 : 0;

      offsetGroupRef.current.position.x = THREE.MathUtils.lerp(
        offsetGroupRef.current.position.x,
        targetX,
        0.15,
      );
      offsetGroupRef.current.position.y = THREE.MathUtils.lerp(
        offsetGroupRef.current.position.y,
        targetY,
        0.15,
      );
      offsetGroupRef.current.position.z = THREE.MathUtils.lerp(
        offsetGroupRef.current.position.z,
        targetZ,
        0.15,
      );
    }

    // 7. Позиционирование и поворот всей модели
    if (groupRef.current) {
      const isMobile = window.innerWidth < 768;
      const positions = isMobile ? AVATAR_POSITIONS_MOBILE : AVATAR_POSITIONS;
      const pos = positions[currentAnim] || positions.standing;

      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pos.y, 0.15);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pos.x, 0.1);

      const targetRotY = AVATAR_ROTATIONS[currentAnim] ?? 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.1,
      );
    }
  });

  return (
    <group ref={groupRef} rotation={[0, AVATAR_ROTATIONS.typing, 0]} {...props} dispose={null}>
      <group ref={offsetGroupRef}>
        <AvatarModel />
      </group>
    </group>
  );
}

// Предзагрузка анимаций с учетом BASE_URL
useGLTF.preload(`${import.meta.env.BASE_URL}animations/typing.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}animations/standing.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}animations/jump-v2.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}animations/waving.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}animations/salute.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}animations/thumbs.glb`);
