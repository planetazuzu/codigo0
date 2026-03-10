/**
 * Funciones helper para trabajar con procedimientos
 * Usa utilidades genéricas para evitar duplicación
 */

import type { Procedure, Category } from './types.js';
import { procedures } from './data.js';
import { filterByCategory, findById, searchInArray } from '@/utils/filter.js';

/**
 * Obtener procedimientos por categoría
 */
export const getProceduresByCategory = (category: Category): Procedure[] => {
  return filterByCategory(procedures, category);
};

/**
 * Obtener procedimiento por ID
 * 
 * @param id - ID del procedimiento a buscar
 * @returns Procedimiento encontrado o undefined si no existe
 */
export const getProcedureById = (id: string): Procedure | undefined => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return undefined;
  }
  return findById(procedures, id);
};

/**
 * Obtener procedimiento por ID con validación explícita
 * 
 * @param id - ID del procedimiento a buscar
 * @returns Resultado seguro con validación explícita
 */
export const getProcedureByIdSafe = (id: string): { success: boolean; data?: Procedure; error?: Error } => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { 
      success: false, 
      error: new Error('ID de procedimiento inválido o vacío') 
    };
  }
  
  const found = findById(procedures, id);
  
  if (!found) {
    return { 
      success: false, 
      error: new Error(`Procedimiento con ID "${id}" no encontrado`) 
    };
  }
  
  return { success: true, data: found };
};

/**
 * Buscar procedimientos por título, subtítulo o pasos
 */
export const searchProcedures = (query: string): Procedure[] => {
  return searchInArray(procedures, query, [
    (p) => p.title,
    (p) => p.shortTitle,
    (p) => p.steps,
  ]);
};
