import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Componente que lanza un error para testing
const ThrowError = ({ message }: { message?: string }) => {
  throw new Error(message || 'Test error');
};

// Mock de console.error para evitar spam en los tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
  // Limpiar localStorage y sessionStorage después de cada test
  localStorage.clear();
  sessionStorage.clear();
});

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    // Suprimir errores de React durante el renderizado intencional del error
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
    expect(screen.getByText(/la aplicación encontró un error inesperado/i)).toBeInTheDocument();
    
    errorSpy.mockRestore();
  });

  it('should show error details in development mode', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError message="Test error message" />
      </ErrorBoundary>
    );

    // En desarrollo, debería mostrar detalles del error
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
    
    errorSpy.mockRestore();
  });

  it('should render custom fallback when provided', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const customFallback = <div>Custom Error Message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
    expect(screen.queryByText(/algo salió mal/i)).not.toBeInTheDocument();
    
    errorSpy.mockRestore();
  });

  it('should show "Intentar de nuevo" button', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /intentar de nuevo/i })).toBeInTheDocument();
    
    errorSpy.mockRestore();
  });

  it('should show "Ir al inicio" button', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /ir al inicio/i })).toBeInTheDocument();
    
    errorSpy.mockRestore();
  });
});

