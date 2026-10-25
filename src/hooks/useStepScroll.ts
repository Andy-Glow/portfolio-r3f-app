import { useScrollNavigation } from "./useScrollNavigation";
import { useScrollGestures } from "./useScrollGestures";

// Этот хук объединяет в себе логику навигации и жестов.

export function useStepScroll() {
  useScrollNavigation();
  useScrollGestures();
}
