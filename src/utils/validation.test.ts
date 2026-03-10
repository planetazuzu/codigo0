import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { safeValidate, validate } from './validation';

const testSchema = z.object({
  name: z.string().min(1),
  count: z.number().int().positive().optional(),
});

describe('validation utils', () => {
  describe('validate', () => {
    it('devuelve datos cuando el input es válido', () => {
      const result = validate(testSchema, { name: 'test' });
      expect(result).toEqual({ name: 'test' });
    });

    it('lanza ZodError cuando el input es inválido', () => {
      expect(() => validate(testSchema, {})).toThrow();
      expect(() => validate(testSchema, { name: '' })).toThrow();
    });
  });

  describe('safeValidate', () => {
    it('devuelve success true y data cuando el input es válido', () => {
      const result = safeValidate(testSchema, { name: 'ok', count: 5 });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: 'ok', count: 5 });
      expect(result.errors).toBeUndefined();
    });

    it('devuelve success false y errors cuando el input es inválido', () => {
      const result = safeValidate(testSchema, {});
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
    });
  });
});
