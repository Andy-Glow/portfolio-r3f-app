import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  CROSSFADE_TIME,
  JUMP_TIME_SCALE,
  PAGE_ANIMATIONS,
  SALUTE_TIME_SCALE,
  TRANSITION_DELAY,
} from "../constants/avatar";
import { useScrollProgress } from "../components/ScrollProvider";

export function useAvatarAnimation(
  actions: Record<string, THREE.AnimationAction>,
  mixer: THREE.AnimationMixer,
) {
  const progressRef = useScrollProgress();
  const [currentAnim, setCurrentAnim] = React.useState<string>("typing");
  const currentAnimRef = React.useRef("typing");
  const transitionTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = React.useRef(true);

  // Следим за изменением прогресса между кадрами
  const lastProgress = React.useRef(0);

  useFrame(() => {
    const progress = progressRef.current;

    if (isFirstRender.current) {
      if (progress > 0.05) isFirstRender.current = false;
      lastProgress.current = progress;
      return;
    }

    // Проверяем, движется ли скролл прямо сейчас
    const isMoving = Math.abs(progress - lastProgress.current) > 0.0005;
    lastProgress.current = progress;

    const exactPage = progress * 3;
    const currentPage = Math.round(exactPage);

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
      // Если скролл остановился, плавно переходим в нужную анимацию
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

  React.useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    if (!mixer) return;

    const onFinished = (e: any) => {
      const finishedActionName = Object.keys(actions).find((key) => actions[key] === e.action);

      if (
        finishedActionName &&
        finishedActionName === currentAnimRef.current &&
        (finishedActionName === "waving" ||
          finishedActionName === "salute" ||
          finishedActionName === "thumbs")
      ) {
        currentAnimRef.current = "standing";
        setCurrentAnim("standing");
      }
    };

    mixer.addEventListener("finished", onFinished);
    return () => mixer.removeEventListener("finished", onFinished);
  }, [mixer, actions]);

  React.useEffect(() => {
    let nextAction = actions[currentAnim];
    let actualAnim = currentAnim;

    if (!nextAction) {
      actualAnim = "standing";
      nextAction = actions["standing"];
    }
    if (!nextAction) return;

    if (actualAnim === "jumping") {
      window.dispatchEvent(new Event("avatar-jump-start"));
    } else {
      window.dispatchEvent(new Event("avatar-jump-end"));
    }

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
