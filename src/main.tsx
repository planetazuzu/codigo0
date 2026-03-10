import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PatientContextProvider } from "./clinical/patient";
import "./index.css";

// ==================== ERROR HANDLING GLOBAL ====================

// Suprimir errores de extensiones del navegador (no críticos)
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Filtrar errores de extensiones del navegador
    const message = args[0]?.toString() || '';
    if (
      message.includes('message channel closed') ||
      message.includes('runtime.lastError') ||
      message.includes('Extension context invalidated')
    ) {
      // Silenciar estos errores (son de extensiones del navegador, no de nuestra app)
      return;
    }
    originalError.apply(console, args);
  };

  // Capturar errores no manejados (JavaScript síncronos)
  window.addEventListener('error', (event) => {
    console.error('[Global Error Handler]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
    
    // En producción, podrías enviar esto a un servicio de logging
    // Por ahora, solo lo logueamos en consola
  });

  // Capturar promesas rechazadas no manejadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', {
      reason: event.reason,
      promise: event.promise,
    });
    
    // Prevenir el comportamiento por defecto (mostrar en consola)
    // event.preventDefault();
  });
}

// CRÍTICO: Desregistrar Service Worker en desarrollo ANTES de cualquier otra cosa
// Esto evita que el SW intercepte peticiones de Vite HMR
if ('serviceWorker' in navigator) {
  const isDevelopment = import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';
  
  if (isDevelopment) {
    // Desregistrar inmediatamente (síncrono si es posible)
    (async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          console.log('[SW] 🧹 Development mode: unregistering', registrations.length, 'service worker(s)...');
          
          // Desregistrar todos
          await Promise.all(registrations.map(reg => reg.unregister()));
          
          // Limpiar caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('[SW] ✅ Caches cleared');
          }
          
          console.log('[SW] ✅ Service workers unregistered');
          
          // Si había un SW activo, recargar
          if (navigator.serviceWorker.controller) {
            console.log('[SW] 🔄 Reloading to apply changes...');
            window.location.reload();
            return; // No continuar con el resto del código
          }
        }
      } catch (error) {
        console.error('[SW] ❌ Error cleaning up:', error);
      }
    })();
  }
}

// Registrar Service Worker para PWA (solo en producción)
if ('serviceWorker' in navigator) {
  // No registrar SW en desarrollo para evitar conflictos con Vite HMR
  const isDevelopment = import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';
  
  if (!isDevelopment) {
    // En producción, registrar SW normalmente
    window.addEventListener('load', () => {
      // Detectar base path dinámicamente (para GitHub Pages)
      const base = import.meta.env.BASE_URL || '/';
      navigator.serviceWorker
        .register(`${base}sw.js`, {
          updateViaCache: 'none', // Siempre verificar actualizaciones del SW
        })
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);
        
        // Verificar actualizaciones periódicamente
        const checkForUpdates = () => {
          registration.update().catch((err) => {
            console.log('[SW] Update check failed:', err);
          });
        };
        
        // Verificar cada hora
        setInterval(checkForUpdates, 60 * 60 * 1000);
        
        // Verificar también cuando la página recupera el foco
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            checkForUpdates();
          }
        });
        
        // Escuchar actualizaciones disponibles
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Hay una nueva versión instalada y esperando
              console.log('[SW] New version available');
              // El hook useServiceWorker manejará la notificación
            }
          });
        });
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
    });
  }
}

// Asegurar que React está disponible antes de renderizar
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Renderizar la app
// Nota: Si ves errores de "useLayoutEffect", puede ser un problema de code splitting.
// Asegúrate de que vendor-react se carga antes que otros chunks.
try {
  createRoot(rootElement).render(
    <PatientContextProvider>
      <App />
    </PatientContextProvider>
  );
} catch (error) {
  console.error('[React] Error rendering app:', error);
  // ✅ FIX XSS: Usar textContent en lugar de innerHTML para prevenir XSS
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 2rem; text-align: center; font-family: sans-serif;';
  
  const h1 = document.createElement('h1');
  h1.textContent = 'Error al cargar la aplicación';
  errorDiv.appendChild(h1);
  
  const p1 = document.createElement('p');
  p1.textContent = 'Por favor, recarga la página. Si el problema persiste, limpia la caché del navegador.';
  errorDiv.appendChild(p1);
  
  const p2 = document.createElement('p');
  p2.style.cssText = 'color: #666; font-size: 0.9rem;';
  p2.textContent = `Error: ${errorMessage}`;
  errorDiv.appendChild(p2);
  
  rootElement.innerHTML = '';
  rootElement.appendChild(errorDiv);
  
  throw error;
}
