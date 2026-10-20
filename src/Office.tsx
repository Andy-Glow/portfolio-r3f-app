import React from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: any;
  };
  materials: {
    [key: string]: THREE.MeshStandardMaterial;
  };
};

export function Office(props: React.ComponentProps<"group">) {
  // 1. Загружаем геометрию сцены-комнаты
  const { nodes } = useGLTF("/models/scene.gltf") as unknown as GLTFResult;

  // 2. Загружаем запеченную карту света и теней, которую ты скачал
  const bakedTexture = useTexture("/textures/baked.jpg");

  // Корректируем UV-развертку под стандарты отображения Three.js
  bakedTexture.flipY = false;
  bakedTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. Создаем MeshBasicMaterial, чтобы сцена не тратила ресурсы на расчет динамического света
  const bakedMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: bakedTexture,
      }),
    [bakedTexture],
  );

  return (
    <group {...props} dispose={null}>
      {/* Пробегаем по всем объектам сцены и применяем к ним готовую карту теней */}
      {Object.keys(nodes).map((key) => {
        const node = nodes[key];
        if (node.isMesh) {
          return (
            <mesh
              key={key}
              geometry={node.geometry}
              material={bakedMaterial}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

useGLTF.preload("/models/scene.gltf");
useTexture.preload("/textures/baked.jpg");
