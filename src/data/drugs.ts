/**
 * Punto de entrada de fármacos.
 * Re-exporta desde drugs/ (split por categoría) para mantener compatibilidad
 * con imports desde @/data/drugs o @/data/drugs.ts.
 */
export {
  drugs,
  getDrugsByCategory,
  getDrugById,
  searchDrugs,
  tesMedications,
} from './drugs/index.js';
export type { Drug, DrugCategory, AdministrationRoute, TESMedication } from './drugs/index.js';
