/**
 * Funciones helper para trabajar con fármacos
 * Usa utilidades genéricas para evitar duplicación
 */

import type { Drug, DrugCategory } from './types.js';
import { drugs } from './index.js';
import { filterByCategory, findById, searchInArray } from '@/utils/filter.js';

/**
 * Obtener fármacos por categoría
 */
export const getDrugsByCategory = (category: DrugCategory): Drug[] => {
  return filterByCategory(drugs, category);
};

/**
 * Obtener fármaco por ID
 */
export const getDrugById = (id: string): Drug | undefined => {
  return findById(drugs, id);
};

/**
 * Buscar fármacos por nombre genérico, comercial o indicaciones
 */
export const searchDrugs = (query: string): Drug[] => {
  return searchInArray(drugs, query, [
    (d) => d.genericName,
    (d) => d.tradeName,
    (d) => d.indications,
  ]);
};
