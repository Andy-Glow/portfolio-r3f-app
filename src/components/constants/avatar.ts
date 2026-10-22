export const JUMP_TIME_SCALE = 1.5;
export const SALUTE_TIME_SCALE = 0.8;
export const CROSSFADE_TIME = 0.4;
export const TRANSITION_DELAY = 150;

export const AVATAR_POSITIONS: Record<string, { x: number; y: number }> = {
  typing: { x: 0.2, y: -1.7 },
  jumping: { x: 0.4, y: -0.9 },
  standing: { x: 0.4, y: -0.9 },
  waving: { x: 0.4, y: -0.9 },
  salute: { x: 0.4, y: -0.9 },
  thumbs: { x: 0.4, y: -0.9 },
};

export const AVATAR_ROTATIONS: Record<string, number> = {
  typing: 2.95,
  standing: 0.3,
  jumping: 0.3,
  waving: 0.3,
  salute: 0.3,
  thumbs: 0.3,
};

export const PAGE_ANIMATIONS = ["typing", "waving", "salute", "thumbs"];
