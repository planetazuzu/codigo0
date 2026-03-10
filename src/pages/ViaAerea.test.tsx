import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViaAerea from './ViaAerea';

const mockProtocol = {
  id: 'obstruccion-via-aerea',
  title: 'Obstrucción de la Vía Aérea',
  shortTitle: 'OVACE',
  category: 'soporte_vital' as const,
  subcategory: undefined,
  priority: 'critico' as const,
  ageGroup: 'adulto' as const,
  steps: ['Paso 1', 'Paso 2'],
  warnings: [],
  keyPoints: [],
  equipment: [],
  drugs: [],
};

const mockRelations = {
  protocol: mockProtocol,
  guide: null,
  manual: null,
  mapping: undefined,
};

vi.mock('@/services/content-adapter', () => ({
  useProtocolAdapter: vi.fn(() => ({
    protocol: mockProtocol,
    isLoading: false,
    isExternal: false,
  })),
}));

vi.mock('@/hooks/useProtocolRelations', () => ({
  useProtocolRelations: vi.fn(() => ({
    status: 'success',
    data: mockRelations,
  })),
}));

vi.mock('@/data/protocol-guide-manual-mapping', () => ({
  getMappingByProtocolId: vi.fn(() => ({
    protocolId: 'obstruccion-via-aerea',
    guideId: null,
    manualId: null,
  })),
}));

describe('ViaAerea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra título Vía Aérea', async () => {
    render(
      <MemoryRouter>
        <ViaAerea />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Vía Aérea/i })).toBeInTheDocument();
    });
  });

  it('no muestra PageLoader cuando datos están cargados', async () => {
    render(
      <MemoryRouter>
        <ViaAerea />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
