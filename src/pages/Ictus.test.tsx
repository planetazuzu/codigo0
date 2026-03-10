import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Ictus from './Ictus';

const mockProcedure = {
  id: 'ictus',
  title: 'Código Ictus',
  shortTitle: 'Ictus',
  category: 'patologias' as const,
  subcategory: undefined,
  priority: 'critico' as const,
  ageGroup: 'adulto' as const,
  steps: ['Activación', 'Valoración', 'Derivación'],
  warnings: [],
  keyPoints: [],
  equipment: [],
  drugs: [],
};

vi.mock('@/data/procedures', () => ({
  getProcedureById: vi.fn((id: string) => (id === 'ictus' ? mockProcedure : undefined)),
}));

vi.mock('@/data/protocol-guide-manual-mapping', () => ({
  getMappingByProtocolId: vi.fn(() => null),
}));

describe('Ictus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra título Código Ictus', async () => {
    render(
      <MemoryRouter>
        <Ictus />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Código Ictus/i })).toBeInTheDocument();
    });
  });

  it('muestra mensaje tiempo es cerebro', async () => {
    render(
      <MemoryRouter>
        <Ictus />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/TIEMPO ES CEREBRO/i)).toBeInTheDocument();
    });
  });

  it('muestra modo checklist cuando protocolo existe', async () => {
    render(
      <MemoryRouter>
        <Ictus />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Modo checklist|checklist/i)).toBeInTheDocument();
    });
  });
});
