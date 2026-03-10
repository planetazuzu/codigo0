import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProtocolRelations } from './useProtocolRelations';

const mockRelations = {
  protocol: { id: 'rcp-adulto-svb', title: 'RCP' },
  guide: null,
  manual: null,
  mapping: undefined,
};

vi.mock('@/services/content-relations', () => ({
  getProtocolRelationsSafe: vi.fn((id: string) => {
    if (!id || id.trim() === '') {
      return { success: false, error: new Error('ID de protocolo requerido') };
    }
    if (id === 'not-found') {
      return { success: false, error: new Error('No encontrado') };
    }
    return { success: true, data: { ...mockRelations, protocol: { ...mockRelations.protocol, id } } };
  }),
}));

describe('useProtocolRelations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('empieza en loading', () => {
    const { result } = renderHook(() => useProtocolRelations('rcp-adulto-svb'));
    expect(result.current.status).toBe('loading');
  });

  it('pasa a success con data para id válido', async () => {
    const { result } = renderHook(() => useProtocolRelations('rcp-adulto-svb'));
    await waitFor(() => {
      expect(result.current.status).not.toBe('loading');
    });
    expect(result.current.status).toBe('success');
    if (result.current.status === 'success') {
      expect(result.current.data?.protocol?.id).toBe('rcp-adulto-svb');
    }
  });

  it('pasa a error para id vacío', async () => {
    const { result } = renderHook(() => useProtocolRelations(''));
    await waitFor(() => {
      expect(result.current.status).not.toBe('loading');
    });
    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.error).toBeDefined();
    }
  });

  it('actualiza cuando cambia el protocolId', async () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useProtocolRelations(id),
      { initialProps: { id: 'rcp-adulto-svb' } }
    );
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
    if (result.current.status === 'success') {
      expect(result.current.data?.protocol?.id).toBe('rcp-adulto-svb');
    }
    rerender({ id: 'shock-hemorragico' });
    await waitFor(() => {
      expect(result.current.status).toBe('success');
      if (result.current.status === 'success') {
        expect(result.current.data?.protocol?.id).toBe('shock-hemorragico');
      }
    });
  });
});
