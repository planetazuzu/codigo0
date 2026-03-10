import { AlertTriangle } from 'lucide-react';

/**
 * Footer con disclaimer legal y enlace de donaciones
 * Visible solo en desktop
 */
const Footer = () => {
  return (
    <footer className="hidden md:block py-6 border-t border-border mt-auto">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Disclaimer legal */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Contenido orientativo
              </p>
              <p className="text-xs text-muted-foreground">
                Esta app no sustituye los protocolos oficiales de tu servicio. 
                Uso bajo responsabilidad del profesional sanitario. 
                Contenido en proceso de validación médica.
              </p>
              <div className="flex gap-3 text-xs mt-2">
                <a href="/descargo-responsabilidad" className="text-primary hover:underline">
                  Descargo de responsabilidad
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="/aviso-legal" className="text-primary hover:underline">
                  Aviso legal
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="/privacidad" className="text-primary hover:underline">
                  Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info y donaciones */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-muted-foreground">
            EMERGES TES - Guía de Protocolos
          </span>
          <span className="text-muted-foreground">•</span>
          <a
            href="https://ko-fi.com/emergestes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Apoya el proyecto EMERGES TES"
            title="Ayuda a mantener EMERGES TES gratuito"
          >
            ☕ Apóyanos
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
