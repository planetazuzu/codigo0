import { describe, it, expect } from 'vitest';
import {
  validateFilters,
  safeValidateFilters,
  categoryFilterSchema,
  filterSchema,
} from './filters';

describe('filters validators', () => {
  describe('categoryFilterSchema', () => {
    it('acepta valores válidos', () => {
      expect(categoryFilterSchema.parse('all')).toBe('all');
      expect(categoryFilterSchema.parse('soporte_vital')).toBe('soporte_vital');
    });

    it('rechaza valores inválidos', () => {
      expect(() => categoryFilterSchema.parse('invalid')).toThrow();
    });
  });

  describe('filterSchema', () => {
    it('acepta objeto vacío', () => {
      expect(filterSchema.parse({})).toEqual({});
    });

    it('acepta filtros completos', () => {
      const input = {
        category: 'cardiovascular',
        type: 'procedure',
        ageGroup: 'adulto',
        searchQuery: 'rcp',
      };
      expect(filterSchema.parse(input)).toEqual(input);
    });

    it('rechaza searchQuery mayor a 100', () => {
      expect(() =>
        filterSchema.parse({ searchQuery: 'a'.repeat(101) })
      ).toThrow();
    });
  });

  describe('validateFilters', () => {
    it('devuelve filtros validados', () => {
      const result = validateFilters({ category: 'respiratorio' });
      expect(result).toEqual({ category: 'respiratorio' });
    });

    it('lanza si input inválido', () => {
      expect(() => validateFilters({ category: 'invalid_cat' })).toThrow();
    });
  });

  describe('safeValidateFilters', () => {
    it('devuelve success true y data cuando válido', () => {
      const result = safeValidateFilters({ type: 'procedure' });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ type: 'procedure' });
    });

    it('devuelve success false cuando inválido', () => {
      const result = safeValidateFilters({ category: 'x' });
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });
  });
});
