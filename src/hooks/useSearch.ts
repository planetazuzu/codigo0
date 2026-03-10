import { useState, useEffect, useMemo } from 'react';
import { searchProcedures, searchDrugs } from '@/services/content-search';
import { expandQueryWithAcronyms } from '@/data/acronyms';
import { safeValidateSearchQuery } from '@/validators/search';
import type { Procedure, Category } from '@/data/procedures';
import type { Drug, DrugCategory } from '@/data/drugs';

export type SearchResult = {
  type: 'procedure' | 'drug';
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  priority?: Procedure['priority'];
  ageGroup?: Procedure['ageGroup'];
};

export type FilterType = 'all' | 'procedure' | 'drug';
export type CategoryFilter = Category | DrugCategory | 'all';

/**
 * Hook para manejar búsquedas con validación y filtrado
 */
export function useSearch(query: string, typeFilter: FilterType = 'all', categoryFilter: CategoryFilter = 'all') {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validar query antes de buscar
  const validatedQuery = useMemo(() => {
    if (query.length < 2) {
      return null;
    }

    const validation = safeValidateSearchQuery({ query, type: typeFilter, category: categoryFilter });
    if (!validation.success) {
      setError('Búsqueda inválida');
      return null;
    }

    setError(null);
    return validation.data?.query || null;
  }, [query, typeFilter, categoryFilter]);

  useEffect(() => {
    if (!validatedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Expandir siglas antes de buscar
      const expandedQuery = expandQueryWithAcronyms(validatedQuery);

      let procedures: SearchResult[] = [];
      let drugs: SearchResult[] = [];

      // Buscar procedimientos si el filtro lo permite
      if (typeFilter === 'all' || typeFilter === 'procedure') {
        const procedureResults = searchProcedures(expandedQuery);
        procedures = procedureResults
          .filter((p) => {
            if (categoryFilter !== 'all' && isProcedureCategory(categoryFilter)) {
              return categoryFilter === p.category;
            }
            return true;
          })
          .map((p): SearchResult => ({
            type: 'procedure',
            id: p.id,
            title: p.shortTitle,
            subtitle: p.category.replace('_', ' '),
            category: p.category,
            priority: p.priority,
            ageGroup: p.ageGroup,
          }));
      }

      // Buscar fármacos si el filtro lo permite
      if (typeFilter === 'all' || typeFilter === 'drug') {
        const drugResults = searchDrugs(expandedQuery);
        drugs = drugResults
          .filter((d) => {
            if (categoryFilter !== 'all' && isDrugCategory(categoryFilter)) {
              return categoryFilter === d.category;
            }
            return true;
          })
          .map((d): SearchResult => ({
            type: 'drug',
            id: d.id,
            title: d.genericName,
            subtitle: d.tradeName,
            category: d.category,
          }));
      }

      setResults([...procedures, ...drugs].slice(0, 12));
    } catch (err) {
      setError('Error al realizar la búsqueda');
      console.error('Error en búsqueda:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [validatedQuery, typeFilter, categoryFilter]);

  return {
    results,
    isSearching,
    error,
  };
}

// Helpers para verificar tipos de categoría
function isProcedureCategory(cat: string): cat is Category {
  return ['soporte_vital', 'patologias', 'escena'].includes(cat);
}

function isDrugCategory(cat: string): cat is DrugCategory {
  return ['cardiovascular', 'respiratorio', 'neurologico', 'analgesia', 'oxigenoterapia', 'otros'].includes(cat);
}
