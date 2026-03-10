import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce de valores
 * 
 * @param value - El valor a debounce
 * @param delay - El delay en milisegundos (por defecto 300ms)
 * @returns El valor debounced
 * 
 * @example
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 300);
 * 
 * useEffect(() => {
 *   // Esta función solo se ejecutará después de que el usuario deje de escribir por 300ms
 *   performSearch(debouncedQuery);
 * }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear un timer que actualizará el valor debounced después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes de que se complete el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


