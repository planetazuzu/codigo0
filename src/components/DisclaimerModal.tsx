import { useState, useEffect } from 'react';
import { AlertTriangle, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DISCLAIMER_KEY = 'emerges-tes-disclaimer-accepted';

export const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó el disclaimer
    const hasAccepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!hasAccepted) {
      // Mostrar después de un pequeño delay para mejor UX
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">
              Aviso Legal Importante
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <p className="text-foreground font-medium">
              Esta aplicación contiene información orientativa sobre protocolos de emergencias sanitarias.
            </p>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Esta aplicación NO SUSTITUYE:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-7">
                <li>Los protocolos oficiales de tu servicio de emergencias</li>
                <li>La formación continuada obligatoria</li>
                <li>El criterio clínico del profesional sanitario</li>
                <li>La supervisión médica cuando sea necesaria</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contenido en proceso de validación
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                El contenido médico de esta aplicación está siendo revisado por profesionales sanitarios. 
                Algunos protocolos pueden no estar completamente validados.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                Responsabilidad del usuario:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>El uso de esta aplicación es bajo tu responsabilidad profesional</li>
                <li>Debes seguir siempre los protocolos de tu servicio</li>
                <li>En caso de duda, consulta con el médico coordinador</li>
                <li>La información está actualizada según las guías ERC/AHA vigentes</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <span className="font-semibold">Objetivo de la app:</span> Proporcionar una referencia rápida 
                de consulta para profesionales TES durante emergencias. Es una herramienta de apoyo, 
                no un protocolo oficial vinculante.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted p-6 space-y-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Al hacer clic en "Aceptar y continuar", confirmas que has leído y comprendido 
              este aviso legal y que eres un profesional sanitario.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              size="lg"
            >
              Aceptar y continuar
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Para más información, consulta nuestra <a href="/descargo-responsabilidad" className="underline hover:text-foreground">política de descargo de responsabilidad</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
