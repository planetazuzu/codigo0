import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites, Favorite, FavoriteType } from './useFavorites';

const STORAGE_KEY = 'emerges-tes-favorites';

describe('useFavorites', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual([]);
  });

  it('should load favorites from localStorage on mount', () => {
    const storedFavorites: Favorite[] = [
      {
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test',
        addedAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFavorites));

    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual(storedFavorites);
    expect(result.current.favorites.length).toBe(1);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json');

    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual([]);
  });

  it('should add a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.addFavorite({
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test',
      });
    });

    expect(result.current.favorites.length).toBe(1);
    expect(result.current.favorites[0].id).toBe('test-1');
    expect(result.current.favorites[0].title).toBe('Test Procedure');
    expect(result.current.favorites[0].addedAt).toBeTypeOf('number');
    
    // Verificar que se guardó en localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
  });

  it('should remove a favorite', () => {
    const storedFavorites: Favorite[] = [
      {
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure 1',
        path: '/test1',
        addedAt: Date.now(),
      },
      {
        id: 'test-2',
        type: 'drug',
        title: 'Test Drug',
        path: '/test2',
        addedAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFavorites));

    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.removeFavorite('test-1');
    });

    expect(result.current.favorites.length).toBe(1);
    expect(result.current.favorites[0].id).toBe('test-2');
  });

  it('should check if an item is favorite', () => {
    const storedFavorites: Favorite[] = [
      {
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test',
        addedAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFavorites));

    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.isFavorite('test-1')).toBe(true);
    expect(result.current.isFavorite('test-2')).toBe(false);
  });

  it('should toggle a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    
    // Añadir
    act(() => {
      result.current.toggleFavorite({
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test',
      });
    });

    expect(result.current.isFavorite('test-1')).toBe(true);

    // Eliminar
    act(() => {
      result.current.toggleFavorite({
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test',
      });
    });

    expect(result.current.isFavorite('test-1')).toBe(false);
  });

  it('should get favorites by type', () => {
    const storedFavorites: Favorite[] = [
      {
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test1',
        addedAt: Date.now(),
      },
      {
        id: 'test-2',
        type: 'drug',
        title: 'Test Drug',
        path: '/test2',
        addedAt: Date.now(),
      },
      {
        id: 'test-3',
        type: 'procedure',
        title: 'Test Procedure 2',
        path: '/test3',
        addedAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFavorites));

    const { result } = renderHook(() => useFavorites());
    
    const procedures = result.current.getFavoritesByType('procedure');
    expect(procedures.length).toBe(2);
    expect(procedures.every(f => f.type === 'procedure')).toBe(true);
    
    const drugs = result.current.getFavoritesByType('drug');
    expect(drugs.length).toBe(1);
    expect(drugs[0].type).toBe('drug');
  });

  it('should clear all favorites', () => {
    const storedFavorites: Favorite[] = [
      {
        id: 'test-1',
        type: 'procedure',
        title: 'Test Procedure',
        path: '/test',
        addedAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFavorites));

    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toEqual([]);
    
    // Verificar que localStorage está vacío
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBe('[]');
  });
});


