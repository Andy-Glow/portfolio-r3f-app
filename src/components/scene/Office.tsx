import React from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useScrollProgress } from "../ScrollProvider";

export function Office(props: React.ComponentProps<"group">) {
  const { scene } = useGLTF("/models/scene.glb");
  const bakedTexture = useTexture("/textures/baked.jpg");
  const progressRef = useScrollProgress();

  bakedTexture.flipY = false;
  bakedTexture.colorSpace = THREE.SRGBColorSpace;

  const bakedMaterial = React.useMemo(
    () => new THREE.MeshBasicMaterial({ map: bakedTexture }),
    [bakedTexture],
  );

  React.useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = bakedMaterial;
      }
    });
  }, [scene, bakedMaterial]);

  const groupRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = progressRef.current;
    const firstScreenProgress = Math.min(progress / 0.25, 1);

    const targetY = THREE.MathUtils.lerp(-1.0, -5.0, firstScreenProgress);
    const targetX = THREE.MathUtils.lerp(0.2, 0.2, firstScreenProgress);

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);

    const targetScale = THREE.MathUtils.lerp(0.75, 0, firstScreenProgress);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1),
    );

    const targetRotationY = THREE.MathUtils.lerp(0, Math.PI / 6, firstScreenProgress);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.1,
    );
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/scene.glb");
useTexture.preload("/textures/baked.jpg");
