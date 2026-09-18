import { useCallback, useEffect, useRef } from "react";

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  { leading = true, trailing = false }: ThrottleOptions = {},
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const lastCallRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (!lastCallRef.current && !leading) {
        lastCallRef.current = now;
      }

      const remaining = delay - (now - lastCallRef.current);
      lastArgsRef.current = args;

      if (remaining <= 0 || remaining > delay) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        lastCallRef.current = now;

        if (leading) {
          callbackRef.current(...args);
        }
      } else if (trailing && !timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = leading ? Date.now() : 0;
          timeoutRef.current = null;

          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
        }, remaining);
      }
    },
    [delay, leading, trailing],
  );
}
