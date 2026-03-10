import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProtocolData } from './useProtocolData';

describe('useProtocolData', () => {
  it('empieza en loading', () => {
    const { result } = renderHook(() => useProtocolData('rcp-adulto-svb'));
    expect(result.current.status).toBe('loading');
  });

  it('pasa a success con data para id existente', async () => {
    const { result } = renderHook(() => useProtocolData('rcp-adulto-svb'));
    await waitFor(() => {
      expect(result.current.status).not.toBe('loading');
    });
    expect(result.current.status).toBe('success');
    if (result.current.status === 'success') {
      expect(result.current.data.id).toBe('rcp-adulto-svb');
      expect(result.current.data.title).toBeDefined();
    }
  });

  it('pasa a not_found para id inexistente', async () => {
    const { result } = renderHook(() => useProtocolData('no-existe-xyz'));
    await waitFor(() => {
      expect(result.current.status).not.toBe('loading');
    });
    expect(result.current.status).toBe('not_found');
  });

  it('pasa a error para id vacío/undefined', async () => {
    const { result } = renderHook(() => useProtocolData(''));
    await waitFor(() => {
      expect(result.current.status).not.toBe('loading');
    });
    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.error).toBeDefined();
    }
  });

  it('actualiza cuando cambia el id', async () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useProtocolData(id),
      { initialProps: { id: 'rcp-adulto-svb' } }
    );
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
    if (result.current.status === 'success') {
      expect(result.current.data.id).toBe('rcp-adulto-svb');
    }
    rerender({ id: 'ictus' });
    await waitFor(() => {
      expect(result.current.status).toBe('success');
      if (result.current.status === 'success') {
        expect(result.current.data.id).toBe('ictus');
      }
    });
  });
});
