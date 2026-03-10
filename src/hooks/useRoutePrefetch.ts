/**
 * Hook para prefetch de rutas cuando el usuario hace hover sobre enlaces
 * 
 * Mejora la experiencia precargando rutas antes de que el usuario las visite
 */

import { useEffect, useRef } from 'react';

/**
 * Hook para prefetch automático de rutas en hover
 * 
 * @param enabled - Si está habilitado (por defecto true)
 */
export function useRoutePrefetch(enabled: boolean = true): void {
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href]') as HTMLAnchorElement | null;
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Solo prefetch rutas internas
      if (href.startsWith('/') && !prefetchedRoutes.current.has(href)) {
        // Prefetch usando link rel="prefetch"
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
        
        prefetchedRoutes.current.add(href);
      }
    };

    // Usar event delegation para mejor rendimiento
    document.addEventListener('mouseenter', handleMouseEnter, { capture: true });

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, { capture: true });
    };
  }, [enabled]);
}

/**
 * Prefetch manual de una ruta específica
 * 
 * @param route - Ruta a prefetch
 */
export function prefetchRoute(route: string): void {
  if (typeof window === 'undefined') return;
  if (route.startsWith('#') || route.startsWith('mailto:') || route.startsWith('tel:')) return;

  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = route;
  document.head.appendChild(prefetchLink);
}

