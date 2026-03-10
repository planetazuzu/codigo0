import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { imageRegistry, hasImageId, findImageById } from '@/data/image-registry';
import { sanitizeImageSrc, sanitizeImageAlt, sanitizeText, sanitizeURL } from '@/utils/sanitize';
import 'highlight.js/styles/github-dark.css';

interface MarkdownViewerProps {
  /**
   * Ruta del archivo .md a cargar
   * Ejemplo: "/manual/BLOQUE_0_FUNDAMENTOS/BLOQUE_00_0_FUNDAMENTOS_EMERGENCIAS.md"
   * O ruta relativa desde public/: "manual/BLOQUE_0_FUNDAMENTOS/archivo.md"
   */
  filePath: string;
  /**
   * Clases CSS adicionales para el contenedor
   */
  className?: string;
  /**
   * Mostrar estado de carga
   */
  showLoading?: boolean;
  /**
   * Mostrar mensaje de error personalizado
   */
  onError?: (error: Error) => void;
  /**
   * Forzar ancho completo (sin límites de lectura)
   */
  fullWidth?: boolean;
}

/**
 * Componente MarkdownViewer que carga y renderiza archivos .md dinámicamente
 * 
 * Características:
 * - Carga dinámica de archivos .md desde public/
 * - Renderizado con react-markdown y plugins avanzados
 * - Estilos consistentes con el diseño de la app
 * - Estados de carga y error
 * - Syntax highlighting para código
 * - Sanitización de HTML para seguridad
 */
const MarkdownViewer = ({
  filePath,
  className = '',
  showLoading = true,
  onError,
  fullWidth = false,
}: MarkdownViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Normalizar ruta: asegurar que empiece con /
    const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;

    setLoading(true);
    setError(null);

    fetch(normalizedPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = `No se pudo cargar el archivo: ${err.message}`;
        setError(errorMessage);
        setLoading(false);
        
        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      });
  }, [filePath, onError]);

  // Estado de carga
  if (loading && showLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando contenido...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Error al cargar archivo</h3>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">Ruta: {filePath}</p>
      </div>
    );
  }

  // Contenido vacío
  if (!content) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay contenido para mostrar</p>
      </div>
    );
  }

  // Renderizar Markdown
  const widthClass = fullWidth ? 'max-w-none' : 'md:max-w-prose lg:max-w-[700px]';

  return (
    <div className={`prose prose-slate dark:prose-invert ${widthClass} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFrontmatter]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeHighlight,
        ]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 mt-8 text-foreground border-b border-border pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold mb-3 mt-6 text-foreground border-b border-border pb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-medium mb-2 mt-4 text-foreground" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-medium mb-2 mt-4 text-foreground" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-base font-medium mb-2 mt-3 text-foreground" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-sm font-medium mb-2 mt-3 text-muted-foreground" {...props} />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="mb-4 text-foreground leading-relaxed" {...props} />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-foreground ml-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground ml-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-2 text-foreground leading-relaxed" {...props} />
          ),

          // Code blocks
          code: ({ node, inline, className: codeClassName, ...props }: any) => {
            const isInline = inline !== false;
            
            if (isInline) {
              return (
                <code 
                  className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono text-foreground" 
                  {...props} 
                />
              );
            }
            
            return (
              <code 
                className={`block p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono text-foreground ${codeClassName || ''}`}
                {...props} 
              />
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="mb-4 rounded-lg overflow-hidden" {...props} />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }: any) => {
            // Detectar bloque de enlace operativo por contenido
            const children = node?.children || [];
            const textContent = children
              .map((child: any) => {
                if (child.type === 'paragraph') {
                  return child.children?.map((c: any) => c.value || '').join('') || '';
                }
                return '';
              })
              .join(' ');
            
            if (textContent.includes('Para acción inmediata') || textContent.includes('operativo-link-block')) {
              return (
                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 my-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 dark:text-blue-400 text-xl">⚠️</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-2">Para acción inmediata durante emergencia, consulta el Protocolo Operativo RCP Adulto SVB.</p>
                        <p className="text-muted-foreground text-sm mb-4">Esta guía de refuerzo es para formación y comprensión profunda. El Protocolo Operativo contiene los pasos exactos, valores precisos y secuencia operativa que necesitas cuando te encuentres en una situación real.</p>
                        <a 
                          href="/rcp" 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          <span>Ver Protocolo Operativo RCP Adulto SVB</span>
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <blockquote 
                className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground bg-muted/50 py-2 rounded-r" 
                {...props} 
              />
            );
          },

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-border">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left text-foreground" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2 text-foreground" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-muted/50 transition-colors" {...props} />
          ),

          // Links
          // ✅ FIX XSS: Sanitizar href antes de renderizar
          a: ({ node, href, ...props }: any) => {
            // Sanitizar URL
            const safeHref = href ? sanitizeURL(href) : '#';
            const isExternal = safeHref.startsWith('http');
            
            return (
              <a 
                className="text-primary hover:underline font-medium" 
                href={safeHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props} 
              />
            );
          },

          // Text formatting
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-foreground" {...props} />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-border" {...props} />
          ),

          // Images
          // ✅ FIX XSS: Sanitizar src y alt antes de renderizar
          img: ({ node, src, alt, ...props }: any) => {
            // Normalizar rutas de imágenes
            let imageSrc = src || '';
            let imageAlt = alt || '';
            let imageCaption = '';
            
            // 1. Intentar resolver desde registry (sistema de alias)
            if (imageSrc && hasImageId(imageSrc)) {
              const metadata = findImageById(imageSrc);
              if (metadata) {
                imageSrc = metadata.path;
                imageAlt = metadata.alt;
                imageCaption = metadata.caption || '';
              }
            }
            // 2. Si no es alias, normalizar ruta directa (compatibilidad con sistema actual)
            else {
              // Si es una ruta relativa que empieza con ./assets o ../assets
              if (imageSrc.startsWith('./assets/') || imageSrc.startsWith('../assets/')) {
                // Convertir a ruta absoluta desde public/
                imageSrc = imageSrc.replace(/^\.\.?\/assets\//, '/assets/');
              }
              // Si es una ruta relativa que empieza con assets/
              else if (imageSrc.startsWith('assets/') && !imageSrc.startsWith('/assets/')) {
                // Convertir a ruta absoluta
                imageSrc = `/${imageSrc}`;
              }
              // Si no empieza con /, asumir que es relativa desde public/
              else if (imageSrc && !imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
                imageSrc = `/${imageSrc}`;
              }
              
              // Si no hay alt, usar el src como fallback
              if (!imageAlt && imageSrc) {
                imageAlt = imageSrc.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Imagen';
              }
            }
            
            // ✅ SANITIZAR: Prevenir XSS en src y alt
            imageSrc = sanitizeImageSrc(imageSrc);
            imageAlt = sanitizeImageAlt(imageAlt);
            imageCaption = imageCaption ? sanitizeText(imageCaption) : '';
            
            // Si src está vacío después de sanitizar, no renderizar
            if (!imageSrc) {
              return null;
            }
            
            // Renderizar imagen con caption si está disponible
            if (imageCaption) {
              return (
                <figure className="my-6">
                  <img 
                    className="rounded-lg max-w-full h-auto border border-border shadow-sm" 
                    src={imageSrc}
                    alt={imageAlt}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback si la imagen no se carga
                      console.warn(`No se pudo cargar la imagen: ${imageSrc}`);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    {...props} 
                  />
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center italic px-2">
                    {imageCaption}
                  </figcaption>
                </figure>
              );
            }
            
            // Renderizar imagen sin caption
            return (
              <img 
                className="rounded-lg my-4 max-w-full h-auto border border-border shadow-sm" 
                src={imageSrc}
                alt={imageAlt || 'Imagen'}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Fallback si la imagen no se carga
                  console.warn(`No se pudo cargar la imagen: ${imageSrc}`);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                {...props} 
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;