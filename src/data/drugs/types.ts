/**
 * Tipos e interfaces para fármacos
 * Extraídos de drugs.ts para mejor organización
 */

export type DrugCategory = 
  | 'cardiovascular' 
  | 'respiratorio' 
  | 'neurologico' 
  | 'analgesia' 
  | 'oxigenoterapia' 
  | 'otros';

export type AdministrationRoute = 
  | 'IV' 
  | 'IM' 
  | 'SC' 
  | 'IO' 
  | 'Nebulizado' 
  | 'SL' 
  | 'Rectal' 
  | 'Nasal';

export interface Drug {
  id: string;
  genericName: string;
  tradeName: string;
  category: DrugCategory;
  presentation: string;
  adultDose: string;
  pediatricDose?: string;
  routes: AdministrationRoute[];
  dilution?: string;
  indications: string[];
  contraindications: string[];
  sideEffects?: string[];
  antidote?: string;
  notes?: string[];
  criticalPoints?: string[]; // Puntos TES críticos específicos
  source?: string; // Fuente del manual
}
