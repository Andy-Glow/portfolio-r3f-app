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
  const { animations: typingClips } = useGLTF("/animations/typing.glb");
  const { animations: standingClips } = useGLTF("/animations/standing.glb");
  const { animations: jumpingClips } = useGLTF("/animations/jump-v2.glb");
  const { animations: wavingClips } = useGLTF("/animations/waving.glb");
  const { animations: saluteClips } = useGLTF("/animations/salute.glb");
  const { animations: thumbsClips } = useGLTF("/animations/thumbs.glb");

  if (typingClips?.[0]) typingClips[0].name = "typing";
  if (standingClips?.[0]) standingClips[0].name = "standing";
  if (jumpingClips?.[0]) jumpingClips[0].name = "jumping";
  if (wavingClips?.[0]) wavingClips[0].name = "waving";
  if (saluteClips?.[0]) saluteClips[0].name = "salute";
  if (thumbsClips?.[0]) thumbsClips[0].name = "thumbs";

  const groupRef = React.useRef<THREE.Group>(null);
  const offsetGroupRef = React.useRef<THREE.Group>(null);

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

  const { actions, mixer } = useAnimations(allAnimations, groupRef) as {
    actions: Record<string, THREE.AnimationAction>;
    mixer: THREE.AnimationMixer;
  };

  const currentAnim = useAvatarAnimation(actions, mixer);

  useFrame(() => {
    // 1. Смещение для стула
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

    // 2. Позиция и поворот
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
        {/* Используем вынесенный компонент модели */}
        <AvatarModel />
      </group>
    </group>
  );
}
