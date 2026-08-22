import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Returns a debounced version of any state value.
 * Updates only after the user stops changing the input for `delayMs`.
 */
export function useDebounceValue<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Creates a debounced version of a callback function.
 * Ensures the callback is only invoked after `delayMs` has elapsed since the last invocation.
 */
export function useDebouncedCallback<Args extends any[]>(
  callback: (...args: Args) => void,
  delayMs: number = 300
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs]
  );
}

/**
 * Throttles a value so it only updates at most once every `limitMs`.
 */
export function useThrottle<T>(value: T, limitMs: number = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limitMs) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limitMs - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limitMs]);

  return throttledValue;
}

/**
 * Creates a throttled callback function that executes at most once every `limitMs`.
 */
export function useThrottledCallback<Args extends any[]>(
  callback: (...args: Args) => void,
  limitMs: number = 200
) {
  const callbackRef = useRef(callback);
  const lastRanRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      const now = Date.now();
      if (now - lastRanRef.current >= limitMs) {
        callbackRef.current(...args);
        lastRanRef.current = now;
      } else {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          callbackRef.current(...args);
          lastRanRef.current = Date.now();
        }, limitMs - (now - lastRanRef.current));
      }
    },
    [limitMs]
  );
}
