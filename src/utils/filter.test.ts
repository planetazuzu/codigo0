import { describe, it, expect } from 'vitest';
import {
  searchInArray,
  filterByCategory,
  highlightItem,
  findById,
} from './filter';

describe('filter utils', () => {
  const items = [
    { id: '1', category: 'a', name: 'Alpha', tags: ['x', 'y'] },
    { id: '2', category: 'b', name: 'Beta', tags: ['y', 'z'] },
    { id: '3', category: 'a', name: 'Gamma', tags: [] },
  ];

  describe('searchInArray', () => {
    it('devuelve vacío si query tiene menos de 2 caracteres', () => {
      expect(searchInArray(items, '', (i) => i.name)).toEqual([]);
      expect(searchInArray(items, 'a', (i) => i.name)).toEqual([]);
    });

    it('filtra por campo string', () => {
      const result = searchInArray(items, 'beta', (i) => i.name);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Beta');
    });

    it('filtra por array de strings', () => {
      const result = searchInArray(items, 'z', (i) => i.tags);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('devuelve vacío si no hay coincidencias', () => {
      expect(searchInArray(items, 'xyz', (i) => i.name)).toEqual([]);
    });
  });

  describe('filterByCategory', () => {
    it('devuelve todos si category es todos', () => {
      expect(filterByCategory(items, 'todos')).toEqual(items);
    });

    it('filtra por categoría', () => {
      const result = filterByCategory(items, 'a');
      expect(result).toHaveLength(2);
      expect(result.every((i) => i.category === 'a')).toBe(true);
    });
  });

  describe('highlightItem', () => {
    it('devuelve igual si highlightId es null', () => {
      expect(highlightItem(items, null)).toEqual(items);
    });

    it('coloca el item con highlightId primero', () => {
      const result = highlightItem(items, '2');
      expect(result[0].id).toBe('2');
      expect(result).toHaveLength(3);
    });
  });

  describe('findById', () => {
    it('encuentra por id', () => {
      expect(findById(items, '2')).toEqual(items[1]);
    });

    it('devuelve undefined si no existe', () => {
      expect(findById(items, '99')).toBeUndefined();
    });
  });
});
