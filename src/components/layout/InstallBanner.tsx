import { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';

/**
 * Banner para instalar la PWA
 */
const InstallBanner = () => {
  const { isInstallable, showBanner, install, dismissBanner } = usePWAInstall();

  // No mostrar si no es instalable o el banner está oculto
  const shouldShow = isInstallable && showBanner;

  if (!shouldShow) {
    return null;
  }

  const handleInstall = async () => {
    await install();
  };

  const handleDismiss = () => {
    dismissBanner();
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 md:px-0">
      <div className="container max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg shadow-lg p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Instalar EMERGES TES</p>
              <p className="text-xs opacity-90 truncate">
                Instala la app para acceso rápido y uso offline
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleInstall}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 whitespace-nowrap"
            >
              Instalar
            </Button>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
