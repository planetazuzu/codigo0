import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { getAllDrugs } from '@/services/content-adapter';
import { tesMedications, type TESMedication } from '@/data/drugs';
import type { Drug, DrugCategory } from '@/data/drugs';
import { safeValidateUrlParams } from '@/validators/url-params';

/**
 * Hook para manejar filtrado de fármacos
 * Extrae la lógica de negocio del componente Farmacos
 */
export function useDrugFilters() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DrugCategory | 'todos' | 'tes'>('tes');
  const [activeTESCategory, setActiveTESCategory] = useState<TESMedication['category'] | 'todos'>('todos');

  // Validar y procesar parámetros de URL
  const urlParams = useMemo(() => {
    const params: Record<string, string | null> = {
      id: searchParams.get('id'),
      category: searchParams.get('category'),
      tesCategory: searchParams.get('tesCategory'),
    };
    return safeValidateUrlParams(params);
  }, [searchParams]);

  // Debounce del query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Sincronizar con parámetros de URL
  useEffect(() => {
    if (urlParams.success && urlParams.data) {
      if (urlParams.data.category) {
        setActiveCategory(urlParams.data.category as DrugCategory | 'todos' | 'tes');
      }
      if (urlParams.data.tesCategory) {
        setActiveTESCategory(urlParams.data.tesCategory as TESMedication['category'] | 'todos');
        setActiveCategory('tes');
      }
    }
  }, [urlParams]);

  // Filtrar fármacos TES
  const filteredTESMedications = useMemo(() => {
    let result: TESMedication[] = [...tesMedications];

    // Filtrar por categoría TES
    if (activeTESCategory !== 'todos') {
      result = result.filter((m) => m.category === activeTESCategory);
    }

    // Filtrar por búsqueda
    if (debouncedSearchQuery.length >= 2) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.indication.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeTESCategory, debouncedSearchQuery]);

  // Filtrar fármacos generales
  const filteredDrugs = useMemo(() => {
    const allDrugs = getAllDrugs();
    let result = [...allDrugs];

    // Filtrar por categoría
    if (activeCategory !== 'todos' && activeCategory !== 'tes') {
      result = result.filter((d) => d.category === activeCategory);
    }

    // Filtrar por búsqueda
    if (debouncedSearchQuery.length >= 2) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.genericName.toLowerCase().includes(query) ||
          (d.tradeName && d.tradeName.toLowerCase().includes(query)) ||
          d.indications.some((i) => i.toLowerCase().includes(query))
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
  }, [activeCategory, debouncedSearchQuery, urlParams]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeTESCategory,
    setActiveTESCategory,
    filteredTESMedications,
    filteredDrugs,
    highlightId: urlParams.success && urlParams.data?.id ? urlParams.data.id : null,
  };
}
