import React from "react";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CROSSFADE_TIME,
  JUMP_TIME_SCALE,
  PAGE_ANIMATIONS,
  SALUTE_TIME_SCALE,
  TRANSITION_DELAY,
} from "../components/constants/avatar";

export function useAvatarAnimation(actions: any, mixer: any) {
  const scroll = useScroll();
  const [currentAnim, setCurrentAnim] = React.useState<string>("typing");
  const currentAnimRef = React.useRef("typing");
  const transitionTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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
          const targetAnim = PAGE_ANIMATIONS[currentPage] || "standing";
          currentAnimRef.current = targetAnim;
          setCurrentAnim(targetAnim);
          transitionTimeout.current = null;
        }, TRANSITION_DELAY);
      }
    }
  });

  // Очистка таймера
  React.useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // Слушаем завершение одноразовых анимаций
  React.useEffect(() => {
    if (!mixer) return;

    const onFinished = (e: any) => {
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
    return () => mixer.removeEventListener("finished", onFinished);
  }, [mixer, actions]);

  // Переключение и настройка клипов
  React.useEffect(() => {
    let nextAction = actions[currentAnim];
    let actualAnim = currentAnim;

    if (!nextAction) {
      actualAnim = "standing";
      nextAction = actions["standing"];
    }
    if (!nextAction) return;

    if (actualAnim === "waving" || actualAnim === "salute" || actualAnim === "thumbs") {
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
    } else {
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      nextAction.clampWhenFinished = false;
    }

    if (actualAnim === "jumping") {
      nextAction.timeScale = JUMP_TIME_SCALE;
    } else if (actualAnim === "salute") {
      nextAction.timeScale = SALUTE_TIME_SCALE;
    } else {
      nextAction.timeScale = 1.0;
    }

    nextAction.reset().fadeIn(CROSSFADE_TIME).play();

    Object.keys(actions).forEach((key) => {
      if (key !== actualAnim && actions[key]) {
        actions[key]?.fadeOut(CROSSFADE_TIME);
      }
    });
  }, [currentAnim, actions]);

  return currentAnim;
}
