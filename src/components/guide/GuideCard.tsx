import { memo } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Guide } from '@/services/content-adapter';
import { GuideModeBadge } from './GuideModeBadge';
import { Download } from 'lucide-react';

interface GuideCardProps {
  guide: Guide;
}

/**
 * Card clicable para una guía de refuerzo
 * 
 * Fase C: Añadido botón de descarga SCORM (opcional)
 * 
 * Muestra:
 * - Icono de la guía
 * - Título y descripción
 * - Badge "Modo Formación"
 * - Número de secciones
 * - Botón "Descargar SCORM" (si está disponible)
 */
export const GuideCard = memo(({ guide }: GuideCardProps) => {
  const Icon = (Icons as any)[guide.icono] as LucideIcon || Icons.BookOpen;

  const handleDownloadSCORM = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Descargar paquete SCORM
    const scormUrl = `/scorm/dist/${guide.id}-scorm-1.2.zip`;
    const link = document.createElement('a');
    link.href = scormUrl;
    link.download = `${guide.id}-scorm-1.2.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Link
      to={`/guia-refuerzo/${guide.id}`}
      className="block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-lg">{guide.titulo}</h3>
            <GuideModeBadge />
          </div>
          <p className="text-muted-foreground text-sm mb-3">{guide.descripcion}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{guide.secciones.length} secciones</span>
            </div>
            {/* Fase C: Botón de descarga SCORM (opcional) */}
            {guide.scormAvailable && (
              <button
                onClick={handleDownloadSCORM}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-lg transition-colors"
                title="Descargar paquete SCORM para LMS"
              >
                <Download className="w-3 h-3" />
                <span>SCORM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

GuideCard.displayName = 'GuideCard';

