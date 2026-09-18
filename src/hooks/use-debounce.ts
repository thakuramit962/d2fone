import { useEffect, useState } from "react";

/**
 * Custom hook to debounce rapid value updates (e.g., search input text).
 *
 * @param value The raw input value to debounce
 * @param delay Time in milliseconds to wait before updating the debounced value
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value or delay changes, or on component unmount
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
