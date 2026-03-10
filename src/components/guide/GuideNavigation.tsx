import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getGuide, getGuideSection } from '@/services/content-adapter';

interface GuideNavigationProps {
  guideId: string;
  currentSection: number;
}

/**
 * Navegación entre secciones de una guía
 * 
 * Fase B4: Navegación Formativa Refinada
 * 
 * Muestra:
 * - Botón "Anterior" (si no es la primera sección)
 * - Indicador mejorado: "Sección X de Y · Guía [Título]"
 * - Barra de progreso visual (sin tracking persistente)
 * - Botón "Siguiente" (si no es la última sección)
 * - Botón opcional al protocolo operativo (si existe)
 */
export const GuideNavigation = ({ guideId, currentSection }: GuideNavigationProps) => {
  const guide = getGuide(guideId);
  if (!guide) return null;

  const previousSection = currentSection > 1 ? currentSection - 1 : null;
  const nextSection = currentSection < guide.secciones.length ? currentSection + 1 : null;

  const previousSectionData = previousSection ? getGuideSection(guideId, previousSection) : null;
  const nextSectionData = nextSection ? getGuideSection(guideId, nextSection) : null;

  // Fase B4: Calcular progreso visual (sin tracking persistente)
  const progressPercentage = (currentSection / guide.secciones.length) * 100;

  return (
    <div className="space-y-4 pt-6 border-t border-border">
      {/* Fase B4: Indicador mejorado de sección */}
      <div className="text-center space-y-2">
        <div className="text-sm text-muted-foreground">
          Sección {currentSection} de {guide.secciones.length} · {guide.titulo}
        </div>
        
        {/* Barra de progreso visual */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {Math.round(progressPercentage)}% completado
        </div>
      </div>

      {/* Navegación anterior/siguiente */}
      <div className="flex justify-between items-center">
        {previousSectionData ? (
          <Link
            to={`/guia-refuerzo/${guideId}/seccion/${previousSection}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Anterior</div>
              <div className="font-medium text-foreground text-sm">{previousSectionData.titulo}</div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}

        {nextSectionData ? (
          <Link
            to={`/guia-refuerzo/${guideId}/seccion/${nextSection}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors group"
          >
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Siguiente</div>
              <div className="font-medium text-foreground text-sm">{nextSectionData.titulo}</div>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Botón opcional al protocolo operativo */}
      {guide.protocoloOperativo && (
        <div className="flex justify-center">
          <Link
            to={guide.protocoloOperativo.ruta}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <span>Ir a Protocolo Operativo</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

