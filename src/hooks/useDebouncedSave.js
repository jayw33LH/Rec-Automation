import { useEffect, useRef } from 'react';

export function useDebouncedSave(value, onSave, delay = 500) {
  const timerRef = useRef(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSaveRef.current(value), delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);
}
