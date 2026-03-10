import { z } from 'zod';

/**
 * Validación de parámetros de URL
 */
export const urlParamsSchema = z.object({
  id: z.string().regex(/^[a-z0-9\-_]+$/, 'ID inválido').max(100).optional(),
  category: z.string().max(50).optional(),
  tab: z.string().max(50).optional(),
  tesCategory: z.string().max(50).optional(),
});

export type UrlParamsInput = z.infer<typeof urlParamsSchema>;

/**
 * Valida parámetros de URL de forma segura
 */
export function validateUrlParams(input: Record<string, string | null>): UrlParamsInput {
  // Convertir null a undefined para Zod
  const cleaned = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value ?? undefined])
  );
  return urlParamsSchema.parse(cleaned);
}

/**
 * Valida parámetros de URL de forma segura (no lanza error)
 */
export function safeValidateUrlParams(input: Record<string, string | null>): {
  success: boolean;
  data?: UrlParamsInput;
  errors?: z.ZodError;
} {
  const cleaned = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value ?? undefined])
  );
  const result = urlParamsSchema.safeParse(cleaned);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? undefined : result.error,
  };
}
