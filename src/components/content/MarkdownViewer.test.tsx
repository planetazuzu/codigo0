import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MarkdownViewer from './MarkdownViewer';

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MarkdownViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show loading state initially', async () => {
    // Mock de fetch que se resuelve después de un delay
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              text: () => Promise.resolve('# Test Content'),
            } as Response);
          }, 100);
        })
    );

    render(<MarkdownViewer filePath="/test.md" showLoading={true} />);

    // Debería mostrar el estado de carga
    expect(screen.getByText(/cargando contenido/i)).toBeInTheDocument();
  });

  it('should render markdown content when loaded successfully', async () => {
    const markdownContent = '# Test Heading\n\nThis is test content.';
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(markdownContent),
    } as Response);

    render(<MarkdownViewer filePath="/test.md" />);

    // Esperar a que se cargue el contenido
    await waitFor(() => {
      expect(screen.getByText('Test Heading')).toBeInTheDocument();
    });

    expect(screen.getByText('This is test content.')).toBeInTheDocument();
  });

  it('should show error message when file fails to load', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<MarkdownViewer filePath="/nonexistent.md" />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar archivo/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/no se pudo cargar el archivo/i)).toBeInTheDocument();
  });

  it('should show error message for HTTP errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    render(<MarkdownViewer filePath="/notfound.md" />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar archivo/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/error 404/i)).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', async () => {
    const onErrorMock = vi.fn();
    const error = new Error('Network error');
    
    mockFetch.mockRejectedValueOnce(error);

    render(<MarkdownViewer filePath="/test.md" onError={onErrorMock} />);

    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalled();
    });

    expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should show empty content message when content is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(''),
    } as Response);

    render(<MarkdownViewer filePath="/empty.md" />);

    await waitFor(() => {
      expect(screen.getByText(/no hay contenido para mostrar/i)).toBeInTheDocument();
    });
  });

  it('should normalize file path (add leading slash)', async () => {
    const markdownContent = '# Test';
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(markdownContent),
    } as Response);

    render(<MarkdownViewer filePath="test.md" />);

    // Verificar que fetch fue llamado con la ruta normalizada
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/test.md');
    });
  });

  it('should display file path in error message', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<MarkdownViewer filePath="/custom/path.md" />);

    await waitFor(() => {
      expect(screen.getByText(/ruta:.*custom\/path\.md/i)).toBeInTheDocument();
    });
  });

  it('should not show loading state when showLoading is false', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              text: () => Promise.resolve('# Test'),
            } as Response);
          }, 100);
        })
    );

    render(<MarkdownViewer filePath="/test.md" showLoading={false} />);

    // No debería mostrar el spinner de carga
    expect(screen.queryByText(/cargando contenido/i)).not.toBeInTheDocument();
  });

  it('should render markdown with proper formatting', async () => {
    const markdownContent = `
# Heading 1
## Heading 2

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2

\`inline code\`

\`\`\`javascript
const code = 'block';
\`\`\`
    `.trim();
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(markdownContent),
    } as Response);

    render(<MarkdownViewer filePath="/test.md" />);

    await waitFor(() => {
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Heading 2')).toBeInTheDocument();
    expect(screen.getByText(/This is a paragraph/i)).toBeInTheDocument();
  });

  it('should handle multiple sequential file loads', async () => {
    const firstContent = '# First File';
    const secondContent = '# Second File';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(firstContent),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(secondContent),
      } as Response);

    const { rerender } = render(<MarkdownViewer filePath="/first.md" />);

    await waitFor(() => {
      expect(screen.getByText('First File')).toBeInTheDocument();
    });

    rerender(<MarkdownViewer filePath="/second.md" />);

    await waitFor(() => {
      expect(screen.getByText('Second File')).toBeInTheDocument();
    });

    expect(screen.queryByText('First File')).not.toBeInTheDocument();
  });
});

