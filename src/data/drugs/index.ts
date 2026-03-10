/**
 * Módulo principal de fármacos
 * Re-exporta todos los fármacos y funciones helper
 * Mantiene compatibilidad con imports existentes
 */

import type { Drug, DrugCategory, AdministrationRoute } from './types.js';
import { cardiovascularDrugs } from './categories/cardiovascular.js';
import { respiratorioDrugs } from './categories/respiratorio.js';
import { neurologicoDrugs } from './categories/neurologico.js';
import { analgesiaDrugs } from './categories/analgesia.js';
import { oxigenoterapiaDrugs } from './categories/oxigenoterapia.js';
import { otrosDrugs } from './categories/otros.js';

// Combinar todos los fármacos
export const drugs: Drug[] = [
  ...cardiovascularDrugs,
  ...respiratorioDrugs,
  ...neurologicoDrugs,
  ...analgesiaDrugs,
  ...oxigenoterapiaDrugs,
  ...otrosDrugs,
];

// Re-exportar tipos
export type { Drug, DrugCategory, AdministrationRoute };

// Re-exportar funciones helper
export {
  getDrugsByCategory,
  getDrugById,
  searchDrugs,
} from './utils.js';

// Re-exportar TES medications para compatibilidad con imports desde @/data/drugs
export { tesMedications, type TESMedication } from '../tes-medication.js';
