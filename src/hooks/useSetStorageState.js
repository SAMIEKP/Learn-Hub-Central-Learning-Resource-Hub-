import { useEffect, useState } from 'react';
import { readStoredValue, writeStoredValue } from '../utils/storage';

export function useSetStorageState(key, fallback) {
  const [value, setValue] = useState(() => new Set(readStoredValue(key, fallback)));

  useEffect(() => {
    writeStoredValue(key, [...value]);
  }, [key, value]);

  return [value, setValue];
}

export default useSetStorageState;
