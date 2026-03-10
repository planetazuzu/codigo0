import { z } from 'zod';
import { safeValidate, validate } from '@/utils/validation.js';

/**
 * Validación de búsquedas
 */
export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(2, 'La búsqueda debe tener al menos 2 caracteres')
    .max(100, 'La búsqueda no puede exceder 100 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-]+$/, 'La búsqueda contiene caracteres inválidos'),
  type: z.enum(['all', 'procedure', 'drug']).optional(),
  category: z.string().optional(),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

/**
 * Sanitiza y valida una query de búsqueda
 */
export function validateSearchQuery(input: unknown): SearchQueryInput {
  return validate(searchQuerySchema, input);
}

/**
 * Valida una query de búsqueda de forma segura (no lanza error)
 */
export function safeValidateSearchQuery(input: unknown) {
  return safeValidate(searchQuerySchema, input);
}
