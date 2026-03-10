import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('muestra texto Cargando', () => {
    render(<PageLoader />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('renderiza sin fallar', () => {
    const { container } = render(<PageLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
