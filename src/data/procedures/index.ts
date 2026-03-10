/**
 * Módulo principal de procedimientos
 * Re-exporta todos los procedimientos y funciones helper
 * Mantiene compatibilidad con imports existentes
 */

export { procedures } from './data.js';
export type { Procedure, Category, Priority, AgeGroup } from './types.js';

// Re-exportar schemas Zod
export {
  procedureSchema,
  prioritySchema,
  ageGroupSchema,
  categorySchema,
  parseProcedure,
  safeParseProcedure,
} from './schemas.js';
export type { ProcedureSchema, PrioritySchema, AgeGroupSchema, CategorySchema } from './schemas.js';

// Re-exportar funciones helper
export {
  getProceduresByCategory,
  getProcedureById,
  getProcedureByIdSafe,
  searchProcedures,
} from './utils.js';
