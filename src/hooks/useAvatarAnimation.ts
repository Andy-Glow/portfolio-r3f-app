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
import { useScrollProgress } from "../providers/ScrollProvider";

export function useAvatarAnimation(
  actions: Record<string, THREE.AnimationAction>,
  mixer: THREE.AnimationMixer,
) {
  const progressRef = useScrollProgress();

  // Стейт и Ref для текущей анимации (Ref нужен для доступа внутри таймеров и коллбеков)
  const [currentAnim, setCurrentAnim] = React.useState<string>("typing");
  const currentAnimRef = React.useRef("typing");

  // Таймер задержки перед приземлением
  const transitionTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Защита от срабатывания прыжка при самом первом рендере страницы
  const isFirstRender = React.useRef(true);

  // Храним предыдущий прогресс скролла, чтобы вычислять скорость движения
  const lastProgress = React.useRef(0);

  // 1. ОСНОВНОЙ ЦИКЛ: Отслеживание скролла каждый кадр
  useFrame(() => {
    const progress = progressRef.current;

    // Пропускаем первый рендер
    if (isFirstRender.current) {
      if (progress > 0.05) isFirstRender.current = false;
      lastProgress.current = progress;
      return;
    }

    // Вычисляем, движется ли страница прямо сейчас (разница между кадрами)
    const isMoving = Math.abs(progress - lastProgress.current) > 0.0005;
    lastProgress.current = progress;

    // Вычисляем текущую страницу (от 0 до 3)
    const exactPage = progress * 3;
    const currentPage = Math.round(exactPage);

    if (isMoving) {
      // Если едем — сбрасываем таймер и включаем прыжок
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }

      if (currentAnimRef.current !== "jumping") {
        currentAnimRef.current = "jumping";
        setCurrentAnim("jumping");
      }
    } else {
      // Если остановились — запускаем таймер приземления
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

  // Очистка таймера при размонтировании
  React.useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // 2. СЛУШАЕМ ОКОНЧАНИЕ ОДНОРАЗОВЫХ АНИМАЦИЙ (Машем рукой, отдаем честь, показываем класс)
  React.useEffect(() => {
    if (!mixer) return;

    const onFinished = (e: any) => {
      const finishedActionName = Object.keys(actions).find((key) => actions[key] === e.action);

      // Если завершилась именно та одноразовая анимация, которая сейчас активна — переходим в стойку
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

  // 3. ПЕРЕКЛЮЧЕНИЕ И НАСТРОЙКА АНИМАЦИЙ
  React.useEffect(() => {
    let nextAction = actions[currentAnim];
    let actualAnim = currentAnim;

    // Защита на случай, если анимация не загрузилась
    if (!nextAction) {
      actualAnim = "standing";
      nextAction = actions["standing"];
    }
    if (!nextAction) return;

    // Отправляем события для CSS-эффекта скорости (SpeedLines)
    if (actualAnim === "jumping") {
      window.dispatchEvent(new Event("avatar-jump-start"));
    } else {
      window.dispatchEvent(new Event("avatar-jump-end"));
    }

    // Настраиваем зацикливание: waving, salute, thumbs играют 1 раз, остальные — бесконечно
    if (actualAnim === "waving" || actualAnim === "salute" || actualAnim === "thumbs") {
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
    } else {
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      nextAction.clampWhenFinished = false;
    }

    // Настраиваем индивидуальную скорость проигрывания
    if (actualAnim === "jumping") {
      nextAction.timeScale = JUMP_TIME_SCALE;
    } else if (actualAnim === "salute") {
      nextAction.timeScale = SALUTE_TIME_SCALE;
    } else {
      nextAction.timeScale = 1.0;
    }

    // Плавно включаем новую анимацию
    nextAction.reset().fadeIn(CROSSFADE_TIME).play();

    // Плавно выключаем все остальные
    Object.keys(actions).forEach((key) => {
      if (key !== actualAnim && actions[key]) {
        actions[key]?.fadeOut(CROSSFADE_TIME);
      }
    });
  }, [currentAnim, actions]);

  return currentAnim;
}
