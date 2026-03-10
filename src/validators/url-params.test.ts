import { describe, it, expect } from 'vitest';
import { validateUrlParams, safeValidateUrlParams } from './url-params';

describe('url-params validators', () => {
  describe('validateUrlParams', () => {
    it('acepta objeto vacío', () => {
      expect(validateUrlParams({})).toEqual({});
    });

    it('convierte null a undefined y valida', () => {
      expect(
        validateUrlParams({ id: 'rcp-adulto', category: null })
      ).toEqual({ id: 'rcp-adulto', category: undefined });
    });

    it('acepta id con formato slug', () => {
      expect(validateUrlParams({ id: 'via-aerea-1' })).toEqual({
        id: 'via-aerea-1',
      });
    });

    it('lanza si id tiene caracteres inválidos', () => {
      expect(() =>
        validateUrlParams({ id: 'Mayúsculas' })
      ).toThrow();
    });
  });

  describe('safeValidateUrlParams', () => {
    it('devuelve success true y data cuando válido', () => {
      const result = safeValidateUrlParams({ category: 'rcp', tab: 'steps' });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ category: 'rcp', tab: 'steps' });
    });

    it('devuelve success false cuando inválido', () => {
      const result = safeValidateUrlParams({ id: 'INVALID' });
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
    });
  });
});
