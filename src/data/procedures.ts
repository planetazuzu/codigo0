/**
 * Punto de entrada para procedimientos (protocolos operativos).
 * Re-exporta tipos y datos desde el módulo refactorizado en ./procedures/
 */

export type {
  Priority,
  AgeGroup,
  Category,
  Procedure,
} from './procedures/types.js';

export {
  procedures,
  getProceduresByCategory,
  getProcedureById,
  getProcedureByIdSafe,
  searchProcedures,
} from './procedures/index.js';
