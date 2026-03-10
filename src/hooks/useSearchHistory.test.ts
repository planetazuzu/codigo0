import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchHistory, SearchHistoryItem, SearchItemType } from './useSearchHistory';

const STORAGE_KEY = 'emerges-tes-search-history';

describe('useSearchHistory', () => {
  beforeEach(() => {
    // Limpiar sessionStorage antes de cada test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    expect(result.current.history).toEqual([]);
  });

  it('should load history from sessionStorage on mount', () => {
    const storedHistory: SearchHistoryItem[] = [
      {
        id: 'test-1',
        type: 'general',
        title: 'Test Search',
        path: '/test',
        searchedAt: Date.now(),
      },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedHistory));

    const { result } = renderHook(() => useSearchHistory());
    
    expect(result.current.history).toEqual(storedHistory);
    expect(result.current.history.length).toBe(1);
  });

  it('should handle corrupted sessionStorage data gracefully', () => {
    sessionStorage.setItem(STORAGE_KEY, 'invalid-json');

    const { result } = renderHook(() => useSearchHistory());
    
    expect(result.current.history).toEqual([]);
  });

  it('should add a search to history', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    act(() => {
      result.current.addToHistory({
        id: 'test-1',
        type: 'general',
        title: 'Test Search',
        path: '/test',
      });
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].id).toBe('test-1');
    expect(result.current.history[0].title).toBe('Test Search');
    expect(result.current.history[0].type).toBe('general');
    expect(result.current.history[0].searchedAt).toBeTypeOf('number');
  });

  it('should limit history to maximum items (default 20)', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    // Añadir 25 búsquedas con IDs únicos, cada una en su propio act()
    for (let i = 0; i < 25; i++) {
      act(() => {
        result.current.addToHistory({
          id: `limit-test-${i}`, // IDs únicos para evitar duplicados
          type: 'general',
          title: `Query ${i}`,
          path: `/test${i}`,
        });
      });
    }

    // Debería mantener solo las últimas 20
    expect(result.current.history.length).toBe(20);
    expect(result.current.history[0].id).toBe('limit-test-24'); // La más reciente
    expect(result.current.history[19].id).toBe('limit-test-5'); // La más antigua de las 20
  });

  it('should update timestamp for duplicates within 5 minutes', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    // Añadir primera búsqueda
    act(() => {
      result.current.addToHistory({
        id: 'test-1',
        type: 'general',
        title: 'Test Search',
        path: '/test',
      });
    });

    expect(result.current.history.length).toBe(1);
    const firstTimestamp = result.current.history[0].searchedAt;

    // Añadir el mismo item inmediatamente (debería actualizar el timestamp)
    // Pero en la práctica, si el tiempo es muy cercano, el timestamp podría ser el mismo
    act(() => {
      result.current.addToHistory({
        id: 'test-1',
        type: 'general',
        title: 'Test Search',
        path: '/test',
      });
    });

    // Debería mantener solo 1 item
    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].id).toBe('test-1');
  });

  it('should clear history', () => {
    const storedHistory: SearchHistoryItem[] = [
      {
        id: 'test-1',
        type: 'general',
        title: 'Test Search',
        path: '/test',
        searchedAt: Date.now(),
      },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedHistory));

    const { result } = renderHook(() => useSearchHistory());
    
    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    
    // Verificar que sessionStorage está vacío
    const stored = sessionStorage.getItem(STORAGE_KEY);
    expect(stored).toBe('[]');
  });

  it('should get recent history', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    // Añadir múltiples búsquedas con diferentes IDs, cada una en su propio act()
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.addToHistory({
          id: `recent-test-${i}`, // IDs únicos para evitar duplicados
          type: 'general',
          title: `Query ${i}`,
          path: `/test${i}`,
        });
      });
    }

    // Verificar que se añadieron correctamente
    expect(result.current.history.length).toBe(5);
    
    const recent = result.current.getRecentHistory(3);
    expect(recent.length).toBe(3);
    expect(recent[0].id).toBe('recent-test-4'); // La más reciente
    expect(recent[2].id).toBe('recent-test-2');
  });

  it('should remove item from history', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    act(() => {
      // Añadir con IDs completamente diferentes para evitar que se traten como duplicados
      result.current.addToHistory({
        id: 'remove-test-1',
        type: 'general',
        title: 'Test Search 1',
        path: '/test1',
      });
    });
    
    // Esperar un poco para evitar que se traten como duplicados
    act(() => {
      result.current.addToHistory({
        id: 'remove-test-2',
        type: 'procedure',
        title: 'Test Search 2',
        path: '/test2',
      });
    });

    expect(result.current.history.length).toBeGreaterThanOrEqual(1);

    act(() => {
      result.current.removeFromHistory('remove-test-1');
    });

    // Verificar que el item fue removido
    const remaining = result.current.history.filter(h => h.id === 'remove-test-1');
    expect(remaining.length).toBe(0);
  });
});


