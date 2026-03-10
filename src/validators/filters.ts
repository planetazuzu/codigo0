import { z } from 'zod';
import { safeValidate, validate } from '@/utils/validation.js';

/**
 * Validación de filtros de categoría
 */
export const categoryFilterSchema = z.enum([
  'all',
  'soporte_vital',
  'patologias',
  'escena',
  'cardiovascular',
  'respiratorio',
  'neurologico',
  'analgesia',
  'oxigenoterapia',
  'otros',
  'tes',
]);

export type CategoryFilter = z.infer<typeof categoryFilterSchema>;

/**
 * Validación de filtros de tipo
 */
export const typeFilterSchema = z.enum(['all', 'procedure', 'drug']);

export type TypeFilter = z.infer<typeof typeFilterSchema>;

/**
 * Validación de filtros de grupo de edad
 */
export const ageGroupFilterSchema = z.enum(['all', 'adulto', 'pediatrico', 'neonatal', 'todos']);

export type AgeGroupFilter = z.infer<typeof ageGroupFilterSchema>;

/**
 * Schema combinado para filtros
 */
export const filterSchema = z.object({
  category: categoryFilterSchema.optional(),
  type: typeFilterSchema.optional(),
  ageGroup: ageGroupFilterSchema.optional(),
  searchQuery: z.string().max(100).optional(),
});

export type FilterInput = z.infer<typeof filterSchema>;

/**
 * Valida filtros de forma segura
 */
export function validateFilters(input: unknown): FilterInput {
  return validate(filterSchema, input);
}

/**
 * Valida filtros de forma segura (no lanza error)
 */
export function safeValidateFilters(input: unknown) {
  return safeValidate(filterSchema, input);
}
