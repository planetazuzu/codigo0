import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('NotFound', () => {
  it('muestra título y mensaje por defecto', () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText(/recurso no encontrado/i)).toBeInTheDocument();
    expect(screen.getByText(/recurso solicitado no está disponible/i)).toBeInTheDocument();
  });

  it('muestra props personalizados', () => {
    renderWithRouter(
      <NotFound
        title="Página no encontrada"
        message="La ruta no existe"
        backLabel="Volver"
      />
    );
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    expect(screen.getByText('La ruta no existe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument();
  });

  it('muestra enlace Ir al inicio', () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByRole('link', { name: /ir al inicio/i })).toHaveAttribute('href', '/');
  });
});
