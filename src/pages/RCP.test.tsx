import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RCP from './RCP';

const mockProcedure = {
  id: 'rcp-adulto-svb',
  title: 'RCP Adulto SVB',
  shortTitle: 'RCP SVB',
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
  protocol: mockProcedure,
  guide: null,
  manual: null,
  mapping: undefined,
};

vi.mock('@/services/content-adapter', () => ({
  getProtocol: vi.fn((id: string) => (id ? { ...mockProcedure, id } : null)),
  getMappingByProtocolId: vi.fn(() => ({ protocolId: 'rcp-adulto-svb', guideId: 'rcp-adulto-svb', manualId: 'manual' })),
  getAllDrugs: vi.fn(() => []),
  useProtocolAdapter: vi.fn((protocolId: string) => ({
    protocol: { ...mockProcedure, id: protocolId },
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
    protocolId: 'rcp-adulto-svb',
    guideId: 'rcp-adulto-svb',
    manualId: 'manual',
  })),
}));

describe('RCP', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra título del protocolo RCP', async () => {
    render(
      <MemoryRouter>
        <RCP />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/RCP \/ Parada Cardiorrespiratoria/i)).toBeInTheDocument();
    });
  });

  it('muestra pestañas Adulto y Pediátrico', async () => {
    render(
      <MemoryRouter>
        <RCP />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Parada Cardiorrespiratoria/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /adulto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pediátrico/i })).toBeInTheDocument();
  });

  it('no muestra PageLoader cuando relaciones están cargadas', async () => {
    render(
      <MemoryRouter>
        <RCP />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Protocolo de Reanimación Cardiopulmonar/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });

  it('cambia de pestaña al hacer clic en Pediátrico', async () => {
    render(
      <MemoryRouter>
        <RCP />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pediátrico/i })).toBeInTheDocument();
    });

    const tabPed = screen.getByRole('button', { name: /pediátrico/i });
    fireEvent.click(tabPed);

    await waitFor(() => {
      expect(tabPed).toHaveAttribute('aria-selected', 'true');
    });
  });
});
