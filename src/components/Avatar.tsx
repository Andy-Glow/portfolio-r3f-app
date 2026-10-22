import React from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { useAvatarAnimation } from "../hooks/useAvatarAnimation";
import { AVATAR_POSITIONS, AVATAR_ROTATIONS } from "../components/constants/avatar";

export interface AvatarProps extends React.ComponentProps<"group"> {}

export function Avatar({ ...props }: AvatarProps) {
  const { scene } = useGLTF("/models/my-avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as any;

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

  const { actions, mixer } = useAnimations(allAnimations, groupRef);

  // Используем наш вынесенный хук
  const currentAnim = useAvatarAnimation(actions, mixer);

  useFrame((state) => {
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

    // 2. Позиция
    if (groupRef.current) {
      const pos = AVATAR_POSITIONS[currentAnim] || AVATAR_POSITIONS.standing;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pos.y, 0.15);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pos.x, 0.1);

      const targetRotY = AVATAR_ROTATIONS[currentAnim] ?? 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.1,
      );
    }

    // 3. Слежение головой
    if (nodes.Neck && nodes.Head) {
      const strength = currentAnim === "typing" ? 1.0 : 0.2;
      const targetX = state.pointer.x * 3.0 * strength;
      const targetY = -state.pointer.y * 2.4 * strength;

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
    <group ref={groupRef} rotation={[0, AVATAR_ROTATIONS.typing, 0]} {...props} dispose={null}>
      <group ref={offsetGroupRef}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/my-avatar.glb");
useGLTF.preload("/animations/typing.glb");
useGLTF.preload("/animations/standing.glb");
useGLTF.preload("/animations/jump-v2.glb");
useGLTF.preload("/animations/waving.glb");
useGLTF.preload("/animations/salute.glb");
useGLTF.preload("/animations/thumbs.glb");
