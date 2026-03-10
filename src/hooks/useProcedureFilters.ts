import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProtocols } from '@/services/content-adapter';
import type { Procedure, Category } from '@/data/procedures';
import { safeValidateUrlParams } from '@/validators/url-params';

/**
 * Hook para manejar filtrado de procedimientos
 * Extrae la lógica de negocio del componente SoporteVital y similares
 */
export function useProcedureFilters(category: Category) {
  const [searchParams] = useSearchParams();
  const [activeSubcategory, setActiveSubcategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Validar y procesar parámetros de URL
  const urlParams = useMemo(() => {
    const params: Record<string, string | null> = {
      id: searchParams.get('id'),
      subcategory: searchParams.get('subcategory'),
    };
    return safeValidateUrlParams(params);
  }, [searchParams]);

  // Obtener protocolos desde ContentAdapter
  const allProtocols = useMemo(() => getAllProtocols(), []);
  
  // Filtrar por categoría principal
  const categoryProcedures = useMemo(() => {
    return allProtocols.filter((p) => p.category === category);
  }, [allProtocols, category]);

  // Filtrar por subcategoría y búsqueda
  const filteredProcedures = useMemo(() => {
    let result = [...categoryProcedures];

    // Filtrar por subcategoría
    if (activeSubcategory !== 'todos') {
      result = result.filter((p) => p.subcategory === activeSubcategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.shortTitle.toLowerCase().includes(query) ||
          p.steps.some((step) => typeof step === 'string' && step.toLowerCase().includes(query))
      );
    }

    // Ordenar destacado al inicio
    const highlightId = urlParams.success && urlParams.data?.id;
    if (highlightId) {
      result.sort((a, b) => {
        if (a.id === highlightId) return -1;
        if (b.id === highlightId) return 1;
        return 0;
      });
    }

    return result;
  }, [categoryProcedures, activeSubcategory, searchQuery, urlParams]);

  // Sincronizar con parámetros de URL
  useEffect(() => {
    if (urlParams.success && urlParams.data?.subcategory) {
      setActiveSubcategory(urlParams.data.subcategory);
    }
  }, [urlParams]);

  return {
    filteredProcedures,
    activeSubcategory,
    setActiveSubcategory,
    searchQuery,
    setSearchQuery,
    highlightId: urlParams.success && urlParams.data?.id ? urlParams.data.id : null,
  };
}
