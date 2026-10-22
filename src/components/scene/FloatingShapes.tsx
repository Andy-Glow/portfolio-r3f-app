import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Тип для описания одной летающей фигуры
interface OrbitingShapeProps {
  count: number;
  radius: number;
  color: string;
  geometry: React.ReactNode;
  speedMultiplier?: number; // Чтобы фигуры крутились с разной скоростью
}

function OrbitingShape({
  count,
  radius,
  color,
  geometry,
  speedMultiplier = 1,
}: OrbitingShapeProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const shapes = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      angle: (i / count) * Math.PI * 2,
      r: radius * (0.7 + Math.random() * 0.6),
      y: (Math.random() - 0.5) * 2.5,
      speed: (0.2 + Math.random() * 0.4) * speedMultiplier,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      scale: 0.25 + Math.random() * 0.15,
    }));
  }, [count, radius, speedMultiplier]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    shapes.forEach((shape, i) => {
      const currentAngle = shape.angle + time * shape.speed;

      // Позиция (орбита сзади Аватара)
      const x = 0.4 + Math.cos(currentAngle) * shape.r;
      const y = shape.y + Math.sin(time + i) * 0.3;
      const z = -1.0 + Math.sin(currentAngle) * shape.r;

      dummy.position.set(x, y, z);

      // Вращение самой фигуры
      dummy.rotation.set(shape.rotX + time * 0.5, shape.rotY + time * 0.5, shape.rotZ + time * 0.5);

      dummy.scale.setScalar(shape.scale);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
      renderOrder={-1}>
      {geometry}
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Главный компонент, который собирает все фигуры
export function FloatingShapes() {
  return (
    <group>
      {/* 1. Классические кубы (синие) - 15 штук */}
      <OrbitingShape
        count={15}
        radius={6}
        color='#3b82f6'
        speedMultiplier={1.0}
        geometry={<boxGeometry args={[1, 1, 1]} />}
      />

      {/* 2. Октаэдры / "Кристаллы" (фиолетовые) - 10 штук */}
      <OrbitingShape
        count={10}
        radius={7}
        color='#a855f7'
        speedMultiplier={-0.8} // Крутятся в обратную сторону
        geometry={<octahedronGeometry args={[0.8, 0]} />}
      />

      {/* 3. Кольца / Торусы (голубые) - 8 штук */}
      <OrbitingShape
        count={8}
        radius={6.5}
        color='#06b6d4'
        speedMultiplier={1.2}
        // Кольца нужно повернуть, чтобы они красиво смотрелись в полете
        geometry={<torusGeometry args={[0.5, 0.15, 8, 24]} />}
      />
    </group>
  );
}
