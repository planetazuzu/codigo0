import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Shock from './Shock';

const mockProtocol = {
  id: 'shock-hemorragico',
  title: 'Shock Hemorrágico',
  shortTitle: 'Shock Hemorrágico',
  category: 'patologias' as const,
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
    protocolId: 'shock-hemorragico',
    guideId: null,
    manualId: null,
  })),
}));

describe('Shock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra título Shock Hemorrágico', async () => {
    render(
      <MemoryRouter>
        <Shock />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Shock Hemorrágico/i, level: 1 })).toBeInTheDocument();
    });
  });

  it('no muestra PageLoader cuando datos están cargados', async () => {
    render(
      <MemoryRouter>
        <Shock />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Shock Hemorrágico/i, level: 1 })).toBeInTheDocument();
    });

    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
