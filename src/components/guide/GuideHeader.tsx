import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Guide } from '@/services/content-adapter';
import { GuideModeBadge } from './GuideModeBadge';
import { Link } from 'react-router-dom';
import { ExternalLink, Clock, GraduationCap, BookOpen, FileText } from 'lucide-react';
import { getMappingByGuiaId } from '@/data/protocol-guide-manual-mapping';

interface GuideHeaderProps {
  guide: Guide;
}

/**
 * Header específico para una guía de refuerzo
 * 
 * Fase B3: Estructura de las Guías (Claridad Didáctica)
 * 
 * Muestra:
 * - Icono de la guía
 * - Título y descripción
 * - Badge "Modo Formación"
 * - Metadatos visuales:
 *   - 🎓 Modo Formación
 *   - ⏱️ Tiempo estimado
 *   - 🔗 Protocolo relacionado (si existe)
 *   - 📘 Manual relacionado (si existe)
 */
export const GuideHeader = ({ guide }: GuideHeaderProps) => {
  const Icon = (Icons as any)[guide.icono] as LucideIcon || Icons.BookOpen;
  
  // Fase B3: Obtener mapeo para protocolo y manual relacionados
  const mapping = getMappingByGuiaId(guide.id);
  
  // Calcular tiempo estimado: 8 secciones × 5-10 min = 40-60 min
  const tiempoEstimado = '40-60 min';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-3xl font-bold text-foreground">{guide.titulo}</h1>
            <GuideModeBadge />
          </div>
          <p className="text-muted-foreground">Guía de Refuerzo — Modo Formativo</p>
        </div>
      </div>

      {/* Fase B3: Metadatos Visuales - Claridad Didáctica */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
        {/* Tiempo Estimado */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Tiempo estimado: </span>
          <span className="font-medium text-foreground">{tiempoEstimado}</span>
        </div>

        {/* Protocolo Relacionado */}
        {mapping && 'protocoloId' in mapping && mapping.protocoloId && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-muted-foreground">Protocolo relacionado: </span>
            <Link
              to={mapping.protocoloRuta || '#'}
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {mapping.protocoloTitulo}
            </Link>
          </div>
        )}

        {/* Manual Relacionado */}
        {mapping && mapping.tieneManual && mapping.manualRuta && (
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-muted-foreground">Manual relacionado: </span>
            <Link
              to={mapping.manualRuta}
              className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              {mapping.manualTitulo || 'Ver Manual Completo'}
            </Link>
          </div>
        )}

        {/* Fallback: Protocolo desde guide.protocoloOperativo (si no hay mapeo) */}
        {!mapping && guide.protocoloOperativo && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-muted-foreground">Protocolo relacionado: </span>
            <Link
              to={guide.protocoloOperativo.ruta}
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {guide.protocoloOperativo.titulo}
            </Link>
          </div>
        )}
      </div>

      {/* Enlace destacado al protocolo operativo (si existe y hay mapeo) */}
      {mapping && 'protocoloId' in mapping && mapping.protocoloId && mapping.protocoloRuta && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">¿Necesitas el protocolo operativo?</p>
              <p className="font-medium text-foreground">{mapping.protocoloTitulo}</p>
            </div>
            <Link
              to={mapping.protocoloRuta}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span>Ir a Protocolo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Fallback: Enlace destacado desde guide.protocoloOperativo (si no hay mapeo) */}
      {!mapping && guide.protocoloOperativo && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">¿Necesitas el protocolo operativo?</p>
              <p className="font-medium text-foreground">{guide.protocoloOperativo.titulo}</p>
            </div>
            <Link
              to={guide.protocoloOperativo.ruta}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span>Ir a Protocolo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

