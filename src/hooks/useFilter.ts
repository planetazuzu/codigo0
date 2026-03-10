import { useMemo } from 'react';
import { safeValidateFilters } from '@/validators/filters';
import type { FilterInput } from '@/validators/filters';

/**
 * Hook genérico para filtrado de arrays
 * Aplica filtros de categoría, tipo y búsqueda de texto
 */
export function useFilter<T extends Record<string, any>>(
  items: T[],
  filters: {
    category?: string;
    type?: string;
    searchQuery?: string;
    ageGroup?: string;
  },
  options: {
    categoryField?: keyof T;
    typeField?: keyof T;
    searchFields?: (keyof T)[];
    ageGroupField?: keyof T;
  } = {}
) {
  // Validar filtros
  const validatedFilters = useMemo(() => {
    const validation = safeValidateFilters(filters);
    if (!validation.success) {
      console.warn('Filtros inválidos:', validation.errors);
      return null;
    }
    return validation.data;
  }, [filters]);

  const filteredItems = useMemo(() => {
    if (!validatedFilters) {
      return items;
    }

    let result = [...items];

    // Filtrar por categoría
    if (validatedFilters.category && validatedFilters.category !== 'all' && options.categoryField) {
      result = result.filter((item) => item[options.categoryField!] === validatedFilters.category);
    }

    // Filtrar por tipo
    if (validatedFilters.type && validatedFilters.type !== 'all' && options.typeField) {
      result = result.filter((item) => item[options.typeField!] === validatedFilters.type);
    }

    // Filtrar por grupo de edad
    if (validatedFilters.ageGroup && validatedFilters.ageGroup !== 'all' && options.ageGroupField) {
      result = result.filter((item) => {
        const itemAgeGroup = item[options.ageGroupField!];
        return itemAgeGroup === validatedFilters.ageGroup || itemAgeGroup === 'todos';
      });
    }

    // Filtrar por búsqueda de texto
    if (validatedFilters.searchQuery && validatedFilters.searchQuery.length >= 2 && options.searchFields) {
      const query = validatedFilters.searchQuery.toLowerCase();
      result = result.filter((item) => {
        return options.searchFields!.some((field) => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          if (Array.isArray(value)) {
            return value.some((v) => typeof v === 'string' && v.toLowerCase().includes(query));
          }
          return false;
        });
      });
    }

    return result;
  }, [items, validatedFilters, options]);

  return filteredItems;
}
