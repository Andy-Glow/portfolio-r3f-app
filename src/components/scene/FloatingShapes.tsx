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
  // Ссылка на InstancedMesh (позволяет рендерить много объектов за 1 вызов видеокарты)
  const meshRef = useRef<THREE.InstancedMesh>(null);
  // Вспомогательный объект для расчета матриц (позиции, поворота, масштаба)
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Генерируем случайные параметры для каждой фигуры ОДИН раз при монтировании
  const shapes = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      angle: (i / count) * Math.PI * 2, // Стартовый угол по кругу
      r: radius * (0.7 + Math.random() * 0.6), // Случайный радиус для глубины
      y: (Math.random() - 0.5) * 2.5, // Случайная высота
      speed: (0.2 + Math.random() * 0.4) * speedMultiplier, // Скорость вращения
      rotX: Math.random() * Math.PI, // Случайный начальный поворот
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      scale: 0.25 + Math.random() * 0.15, // Случайный размер
    }));
  }, [count, radius, speedMultiplier]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    shapes.forEach((shape, i) => {
      // Вычисляем текущий угол (базовый + время * скорость)
      const currentAngle = shape.angle + time * shape.speed;

      // 1. ПОЗИЦИЯ: Двигаем по эллипсу (cos для X, sin для Z), плюс покачивание по Y
      const x = 0.4 + Math.cos(currentAngle) * shape.r;
      const y = shape.y + Math.sin(time + i) * 0.3; // Плавное покачивание вверх-вниз
      const z = -1.0 + Math.sin(currentAngle) * shape.r; // Орбита смещена назад (за Аватара)

      dummy.position.set(x, y, z);

      // 2. ВРАЩЕНИЕ: Фигуры постоянно вращаются вокруг своих осей
      dummy.rotation.set(shape.rotX + time * 0.5, shape.rotY + time * 0.5, shape.rotZ + time * 0.5);

      // 3. МАСШТАБ: Применяем индивидуальный размер
      dummy.scale.setScalar(shape.scale);

      // Обновляем матрицу и передаем её в InstancedMesh
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    // Сообщаем Three.js, что данные изменились и нужно перерисовать кадр
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
      renderOrder={-1} // Рисуем на самом заднем плане
    >
      {geometry}
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending} // Режим свечения (неон)
        depthWrite={false} // Отключаем запись глубины (чтобы не перекрывать Аватара)
      />
    </instancedMesh>
  );
}

// Главный компонент, который собирает все фигуры
export function FloatingShapes() {
  return (
    <group>
      <OrbitingShape
        count={15}
        radius={6}
        color='#3b82f6'
        speedMultiplier={1.0}
        geometry={<boxGeometry args={[1, 1, 1]} />}
      />
      <OrbitingShape
        count={10}
        radius={7}
        color='#a855f7'
        speedMultiplier={-0.8} // Крутятся в обратную сторону
        geometry={<octahedronGeometry args={[0.8, 0]} />}
      />
      <OrbitingShape
        count={8}
        radius={6.5}
        color='#06b6d4'
        speedMultiplier={1.2}
        geometry={<torusGeometry args={[0.5, 0.15, 8, 24]} />}
      />
    </group>
  );
}
