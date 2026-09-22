import { useCallback, useEffect, useState } from 'react';

const readValue = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    return fallback;
  }
};

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // The UI remains usable when storage is blocked or unavailable.
    }
  }, [key, value]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setValue(JSON.parse(event.newValue));
        } catch (error) {
          // Ignore malformed values from another tab.
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, setValue, reset];
}

export default useLocalStorageState;
