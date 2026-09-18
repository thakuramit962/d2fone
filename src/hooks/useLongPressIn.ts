import { useCallback, useEffect, useRef } from "react";

/**
 * useLongPressIn
 *
 * Call `start()` on pressIn and `stop()` on pressOut.
 * Fires `onTick` immediately on press, then again every `intervalMs`
 * after an initial `delayMs` hold — classic stepper behaviour.
 *
 * @param onTick     - callback to fire on each tick
 * @param delayMs    - hold duration before repeat starts (default 400ms)
 * @param intervalMs - repeat interval once started (default 80ms)
 */
export function useLongPressIn(
  onTick: () => void,
  delayMs = 400,
  intervalMs = 80,
) {
  const tickRef = useRef(onTick);
  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop(); // clear any lingering timers
    tickRef.current();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => tickRef.current(), intervalMs);
    }, delayMs);
  }, [stop, delayMs, intervalMs]);

  // Clean up on unmount
  useEffect(() => stop, [stop]);

  return { start, stop };
}
