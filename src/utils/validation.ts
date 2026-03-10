/**
 * Utilidades genéricas de validación
 * Elimina duplicación entre validators
 */

import { z } from 'zod';

/**
 * Resultado de validación segura
 */
export interface SafeValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}

/**
 * Valida un schema de forma segura (no lanza error)
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): SafeValidationResult<T> {
  const result = schema.safeParse(input);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  };
}

/**
 * Valida un schema (lanza error si falla)
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): T {
  return schema.parse(input);
}
