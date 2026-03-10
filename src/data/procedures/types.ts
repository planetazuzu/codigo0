/**
 * Tipos e interfaces para procedimientos
 * Extraídos de procedures.ts para mejor organización
 */

export type Priority = 'critico' | 'alto' | 'medio' | 'bajo';

export type AgeGroup = 'adulto' | 'pediatrico' | 'neonatal' | 'todos';

export type Category = 'soporte_vital' | 'patologias' | 'escena';

export interface Procedure {
  id: string;
  title: string;
  shortTitle: string;
  category: Category;
  subcategory?: string;
  priority: Priority;
  ageGroup: AgeGroup;
  steps: string[];
  warnings: string[];
  keyPoints?: string[];
  equipment?: string[];
  drugs?: string[];
}
