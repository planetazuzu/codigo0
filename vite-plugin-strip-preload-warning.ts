import type { Plugin } from 'vite';

/**
 * En desarrollo, elimina los <link rel="preload"> de main.tsx e index.css
 * que Vite o el navegador pueden inyectar, para evitar la advertencia:
 * "The resource was preloaded using link preload but not used within a few seconds"
 */
export function stripPreloadWarningPlugin(): Plugin {
  return {
    name: 'strip-preload-warning',
    apply: 'serve',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Quitar preload de /src/main.tsx y /src/index.css (atributos en cualquier orden)
        return html.replace(
          /<link(?=[^>]*\brel=["']preload["'])(?=[^>]*\bhref=["'][^"']*(?:\/src\/main\.tsx|\/src\/index\.css)(?:\?[^"']*)?["'])[^>]*\/?>\s*/gi,
          ''
        );
      },
    },
  };
}
