import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Hook para gestionar la instalación de la PWA
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    if (checkIfInstalled()) {
      return;
    }

    // Escuchar el evento beforeinstallprompt (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que el navegador muestre su propio banner
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      // Mostrar banner después de un pequeño delay (mejor UX)
      setTimeout(() => {
        setShowBanner(true);
      }, 3000); // 3 segundos después de cargar
    };

    // Escuchar cuando se instala la app
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar si ya está instalada al cargar
    const isAlreadyInstalled = checkIfInstalled();
    
    // Si no está instalada, verificar si hay un prompt guardado de una sesión anterior
    if (!isAlreadyInstalled) {
      // En desarrollo, mostrar banner después de un delay para testing
      // Esto permite ver el banner incluso si beforeinstallprompt no se dispara
      let devTimeout: NodeJS.Timeout | null = null;
      
      if (import.meta.env.DEV) {
        devTimeout = setTimeout(() => {
          setIsInstallable(true);
          setShowBanner(true);
        }, 5000);
      }

      return () => {
        if (devTimeout) clearTimeout(devTimeout);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Instalar la PWA
   */
  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      // En desarrollo, simular instalación exitosa para testing
      if (import.meta.env.DEV) {
        setIsInstalled(true);
        setShowBanner(false);
        return true;
      }
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA Install] Error installing PWA:', error);
      return false;
    } finally {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  /**
   * Cerrar el banner
   */
  const dismissBanner = () => {
    setShowBanner(false);
    // Guardar en localStorage que el usuario cerró el banner
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };


  return {
    isInstallable,
    isInstalled,
    showBanner,
    install,
    dismissBanner,
  };
};
