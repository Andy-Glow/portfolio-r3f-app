import React from "react";
import * as THREE from "three";
import { useGLTF, useAnimations, useScroll } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export interface AvatarProps extends React.ComponentProps<"group"> {}

// ==========================================
// НАСТРОЙКИ АНИМАЦИЙ (МЕНЯЙТЕ ЗДЕСЬ)
// ==========================================
const JUMP_TIME_SCALE = 1.5;
const SALUTE_TIME_SCALE = 0.8;
const CROSSFADE_TIME = 0.4;
const TRANSITION_DELAY = 250;

const AVATAR_POSITIONS: Record<string, { x: number; y: number }> = {
  typing: { x: 0.2, y: -1.7 },
  jumping: { x: 0.35, y: -0.9 },
  standing: { x: 0.35, y: -0.9 },
  waving: { x: 0.35, y: -0.9 },
  salute: { x: 0.35, y: -0.9 },
  thumbs: { x: 0.35, y: -0.9 },
};

const AVATAR_ROTATIONS: Record<string, number> = {
  typing: 2.95,
  standing: 0,
  jumping: 0,
  waving: 0,
  salute: 0,
  thumbs: 0,
};

// Теперь при остановке на каждой странице включается своя анимация
// 0 - typing (сидит), 1 - waving (машет), 2 - salute (честь), 3 - thumbs (класс)
const PAGE_ANIMATIONS = ["typing", "waving", "salute", "thumbs"];

export function Avatar({ ...props }: AvatarProps) {
  const { scene } = useGLTF("/models/my-avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as any;

  // Загружаем все модели
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
  const scroll = useScroll();

  const transitionTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const [currentAnim, setCurrentAnim] = React.useState<string>("typing");
  const currentAnimRef = React.useRef("typing");

  // Логика скролла
  useFrame(() => {
    if (!scroll) return;

    const exactPage = scroll.offset * (scroll.pages - 1);
    const currentPage = Math.round(exactPage);
    const isMoving = Math.abs(exactPage - currentPage) > 0.001;

    if (isMoving) {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }

      if (currentAnimRef.current !== "jumping") {
        currentAnimRef.current = "jumping";
        setCurrentAnim("jumping");
      }
    } else {
      if (currentAnimRef.current === "jumping" && !transitionTimeout.current) {
        transitionTimeout.current = setTimeout(() => {
          // Берем нужную анимацию для страницы (0-typing, 1-waving, 2-salute, 3-thumbs)
          const targetAnim = PAGE_ANIMATIONS[currentPage] || "standing";
          currentAnimRef.current = targetAnim;
          setCurrentAnim(targetAnim);
          transitionTimeout.current = null;
        }, TRANSITION_DELAY);
      }
    }
  });

  React.useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // СЛУШАЕМ ЗАВЕРШЕНИЕ ОДНОРАЗОВЫХ АНИМАЦИЙ
  React.useEffect(() => {
    if (!mixer) return;

    const onFinished = (e: any) => {
      // Если завершилась waving, salute или thumbs — плавно переключаем на standing
      if (
        e.action === actions["waving"] ||
        e.action === actions["salute"] ||
        e.action === actions["thumbs"]
      ) {
        currentAnimRef.current = "standing";
        setCurrentAnim("standing");
      }
    };

    mixer.addEventListener("finished", onFinished);
    return () => {
      mixer.removeEventListener("finished", onFinished);
    };
  }, [mixer, actions]);

  // ПЕРЕКЛЮЧЕНИЕ АНИМАЦИЙ И НАСТРОЙКА ЦИКЛОВ
  React.useEffect(() => {
    let nextAction = actions[currentAnim];
    let actualAnim = currentAnim;

    if (!nextAction) {
      actualAnim = "standing";
      nextAction = actions["standing"];
    }

    if (!nextAction) return;

    // Для waving, salute и thumbs ставим "проиграть один раз"
    if (actualAnim === "waving" || actualAnim === "salute" || actualAnim === "thumbs") {
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
    } else {
      // typing, standing, jumping — зацикливаем бесконечно
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      nextAction.clampWhenFinished = false;
    }

    // Скорости
    if (actualAnim === "jumping") {
      nextAction.timeScale = JUMP_TIME_SCALE;
    } else if (actualAnim === "salute") {
      nextAction.timeScale = SALUTE_TIME_SCALE;
    } else {
      nextAction.timeScale = 1.0;
    }

    nextAction.reset().fadeIn(CROSSFADE_TIME).play();

    // Выключаем все остальные
    Object.keys(actions).forEach((key) => {
      if (key !== actualAnim && actions[key]) {
        actions[key]?.fadeOut(CROSSFADE_TIME);
      }
    });
  }, [currentAnim, actions]);

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
      const targetX = state.pointer.x * 1.8 * strength;
      const targetY = -state.pointer.y * 1.1 * strength;

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
