/**
 * Schemas Zod para procedimientos (protocolos operativos).
 * Validación de datos y tipos inferidos alineados con types.ts.
 */

import { z } from 'zod';

export const prioritySchema = z.enum(['critico', 'alto', 'medio', 'bajo']);
export type PrioritySchema = z.infer<typeof prioritySchema>;

export const ageGroupSchema = z.enum(['adulto', 'pediatrico', 'neonatal', 'todos']);
export type AgeGroupSchema = z.infer<typeof ageGroupSchema>;

export const categorySchema = z.enum(['soporte_vital', 'patologias', 'escena']);
export type CategorySchema = z.infer<typeof categorySchema>;

export const procedureSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  category: categorySchema,
  subcategory: z.string().optional(),
  priority: prioritySchema,
  ageGroup: ageGroupSchema,
  steps: z.array(z.string()),
  warnings: z.array(z.string()),
  keyPoints: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  drugs: z.array(z.string()).optional(),
});

export type ProcedureSchema = z.infer<typeof procedureSchema>;

/**
 * Valida un procedimiento de forma segura.
 */
export function parseProcedure(input: unknown): ProcedureSchema {
  return procedureSchema.parse(input);
}

/**
 * Valida un procedimiento sin lanzar; retorna resultado con success.
 */
export function safeParseProcedure(input: unknown): z.SafeParseReturnType<unknown, ProcedureSchema> {
  return procedureSchema.safeParse(input);
}
