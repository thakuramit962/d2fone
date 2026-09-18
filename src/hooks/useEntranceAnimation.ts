import { useEffect, useRef } from "react";
import { Animated } from "react-native";

// ─── Shared defaults (override per call) ─────────────────────────────────────
const DEFAULT_FADE_DURATION = 420;
const DEFAULT_SPRING_TENSION = 60;
const DEFAULT_SPRING_FRICTION = 10;

export type SlideDirection = "up" | "down" | "none";
export type SecondaryEffect = "slide" | "scale" | "swipeUp";

export interface EntranceAnimationOptions {
  /** Delay before the animation fires (ms). Default: 0 */
  delay?: number;
  /** Fade duration (ms). Default: 420 */
  fadeDuration?: number;
  /** Direction the element slides in from. Default: 'up' */
  slideDirection?: SlideDirection;
  /** Distance in px for slide, or starting scale for scale effect. Default: 28 */
  initialOffset?: number;
  /** Spring tension. Default: 60 */
  tension?: number;
  /** Spring friction. Default: 10 */
  friction?: number;
  /** Secondary motion type alongside the fade. Default: 'slide' */
  effect?: SecondaryEffect;
  /** Skip opacity — useful when you only want motion (e.g. swipeUp). Default: false */
  skipFade?: boolean;
}

export interface EntranceAnimationResult {
  fadeAnim: Animated.Value;
  motionAnim: Animated.Value;
}

/**
 * useEntranceAnimation
 *
 * Fires a one-shot entrance animation on mount.
 * Returns two `Animated.Value`s — wire them into your component's style:
 *
 *   const { fadeAnim, motionAnim } = useEntranceAnimation({ delay: 160, slideDirection: 'up' })
 *
 *   <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: motionAnim }] }} />
 *
 * For 'scale' effect use motionAnim as the scale value.
 * For 'swipeUp' effect, skipFade is implied and motionAnim is translateY.
 */
export function useEntranceAnimation(
  options: EntranceAnimationOptions = {},
): EntranceAnimationResult {
  const {
    delay = 0,
    fadeDuration = DEFAULT_FADE_DURATION,
    slideDirection = "up",
    initialOffset = 28,
    tension = DEFAULT_SPRING_TENSION,
    friction = DEFAULT_SPRING_FRICTION,
    effect = "slide",
    skipFade = false,
  } = options;

  // Resolve initial motion value
  const resolvedInitial = (() => {
    if (effect === "scale") return 1 - initialOffset / 100; // e.g. 28 → 0.72; callers pass small values like 4 → 0.96
    if (effect === "swipeUp") return initialOffset; // absolute px offset from below
    return slideDirection === "up" ? initialOffset : -initialOffset;
  })();

  const fadeAnim = useRef(
    new Animated.Value(skipFade || effect === "swipeUp" ? 1 : 0),
  ).current;
  const motionAnim = useRef(new Animated.Value(resolvedInitial)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    if (!skipFade && effect !== "swipeUp") {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeDuration,
          delay,
          useNativeDriver: true,
        }),
      );
    }

    animations.push(
      Animated.spring(motionAnim, {
        toValue: effect === "scale" ? 1 : 0,
        tension,
        friction,
        delay,
        useNativeDriver: true,
      }),
    );

    const composite =
      animations.length === 1 ? animations[0] : Animated.parallel(animations);

    composite.start();

    return () => composite.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fadeAnim, motionAnim };
}
