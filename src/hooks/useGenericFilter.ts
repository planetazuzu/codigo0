/**
 * Hook genérico para filtrado de items
 * Elimina duplicación entre useDrugFilters y useProcedureFilters
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { safeValidateUrlParams } from '@/validators/url-params';
import { searchInArray, filterByCategory, highlightItem } from '@/utils/filter';

export interface FilterConfig<T> {
  /**
   * Función para obtener todos los items
   */
  getAllItems: () => T[];
  
  /**
   * Función para obtener el campo de categoría
   */
  getCategory: (item: T) => string;
  
  /**
   * Campos para buscar
   */
  searchFields: Array<(item: T) => string | string[] | undefined>;
  
  /**
   * Categoría por defecto
   */
  defaultCategory?: string | 'todos';
  
  /**
   * Nombre del parámetro de categoría en URL
   */
  categoryParamName?: string;
  
  /**
   * Nombre del parámetro de ID en URL
   */
  idParamName?: string;
  
  /**
   * Delay para debounce de búsqueda (ms)
   */
  searchDebounceMs?: number;
}

export function useGenericFilter<T extends { id: string; category: string }>(
  config: FilterConfig<T>
) {
  const {
    getAllItems,
    getCategory,
    searchFields,
    defaultCategory = 'todos',
    categoryParamName = 'category',
    idParamName = 'id',
    searchDebounceMs = 300,
  } = config;

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'todos'>(defaultCategory);

  // Validar y procesar parámetros de URL
  const urlParams = useMemo(() => {
    const params: Record<string, string | null> = {
      [idParamName]: searchParams.get(idParamName),
      [categoryParamName]: searchParams.get(categoryParamName),
    };
    return safeValidateUrlParams(params);
  }, [searchParams, idParamName, categoryParamName]);

  // Debounce del query
  const debouncedSearchQuery = useDebounce(searchQuery, searchDebounceMs);

  // Sincronizar con parámetros de URL
  useEffect(() => {
    if (urlParams.success && urlParams.data?.[categoryParamName]) {
      setActiveCategory(urlParams.data[categoryParamName] as string);
    }
  }, [urlParams, categoryParamName]);

  // Obtener todos los items
  const allItems = useMemo(() => getAllItems(), [getAllItems]);

  // Filtrar items
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Filtrar por categoría
    result = filterByCategory(result, activeCategory);

    // Filtrar por búsqueda
    result = searchInArray(result, debouncedSearchQuery, searchFields);

    // Ordenar destacado al inicio
    const highlightId = urlParams.success && urlParams.data?.[idParamName];
    result = highlightItem(result, highlightId ? String(highlightId) : null);

    return result;
  }, [allItems, activeCategory, debouncedSearchQuery, searchFields, urlParams, idParamName]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filteredItems,
    highlightId: urlParams.success && urlParams.data?.[idParamName] 
      ? String(urlParams.data[idParamName]) 
      : null,
  };
}
