/**
 * Utilidades para preloading de recursos críticos
 * 
 * Mejora el rendimiento precargando recursos importantes
 * antes de que el usuario los necesite
 */

/**
 * Preload de recursos críticos
 */
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return;

  // Preload de fuentes críticas
  const fontPreloads = [
    // Si usas fuentes personalizadas, añádelas aquí
    // { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  ];

  fontPreloads.forEach(({ href, as, type, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch de rutas que probablemente se visitarán
 * Se ejecuta cuando el navegador está inactivo
 */
export function prefetchLikelyRoutes(): void {
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch de rutas comunes
      const likelyRoutes = [
        '/soporte-vital',
        '/farmacos',
        '/herramientas',
        '/rcp',
      ];

      likelyRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
}

/**
 * Preconnect a dominios externos críticos
 */
export function preconnectExternalDomains(): void {
  if (typeof window === 'undefined') return;

  const domains = [
    // Añadir dominios externos si los usas
    // { href: 'https://api.example.com', crossOrigin: 'anonymous' },
  ];

  domains.forEach(({ href, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  });
}

/**
 * Inicializar todas las optimizaciones de preload
 */
export function initPreloadOptimizations(): void {
  preloadCriticalResources();
  preconnectExternalDomains();
  
  // Prefetch solo después de que la página esté completamente cargada
  if (document.readyState === 'complete') {
    prefetchLikelyRoutes();
  } else {
    window.addEventListener('load', prefetchLikelyRoutes);
  }
}

