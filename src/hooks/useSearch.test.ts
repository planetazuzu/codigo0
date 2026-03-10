import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSearch } from './useSearch';

vi.mock('@/services/content-search', () => ({
  searchProcedures: vi.fn((q: string) =>
    q.toLowerCase().includes('rcp') ? [{ id: 'rcp-adulto-svb', shortTitle: 'RCP SVB', category: 'soporte_vital', priority: 'critico', ageGroup: 'adulto' }] : []
  ),
  searchDrugs: vi.fn((_q: string) => []),
}));

vi.mock('@/data/acronyms', () => ({
  expandQueryWithAcronyms: vi.fn((q: string) => q),
}));

vi.mock('@/validators/search', () => ({
  safeValidateSearchQuery: vi.fn((input: { query: string }) => {
    const q = (input as { query: string }).query;
    if (!q || q.length < 2) return { success: false };
    if (q.length > 100) return { success: false };
    return { success: true, data: { query: q.trim() } };
  }),
}));

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve resultados vacíos y no buscando para query corta', async () => {
    const { result } = renderHook(() => useSearch('a'));
    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('devuelve resultados cuando query es válida y hay coincidencias', async () => {
    const { result } = renderHook(() => useSearch('rcp'));
    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
    expect(result.current.results.length).toBeGreaterThan(0);
    expect(result.current.results[0].type).toBe('procedure');
    expect(result.current.results[0].id).toBe('rcp-adulto-svb');
    expect(result.current.error).toBeNull();
  });

  it('limita resultados a 12', async () => {
    const { searchProcedures } = await import('@/services/content-search');
    vi.mocked(searchProcedures).mockReturnValue(
      Array.from({ length: 20 }, (_, i) => ({
        id: `p-${i}`,
        shortTitle: `Proc ${i}`,
        category: 'soporte_vital',
        priority: 'critico' as const,
        ageGroup: 'adulto' as const,
      }))
    );
    const { result } = renderHook(() => useSearch('xy'));
    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
    expect(result.current.results.length).toBeLessThanOrEqual(12);
  });
});
