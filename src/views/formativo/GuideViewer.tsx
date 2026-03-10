import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGuide } from '@/services/content-adapter';
import { GuideHeader } from '@/components/guide/GuideHeader';
import { GuideMarkdownViewer } from '@/components/guide/GuideMarkdownViewer';
import { GuideNavigation } from '@/components/guide/GuideNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/ui/BackButton';
import { getGuideRelations } from '@/services/content-relations';
import { FileText, BookOpen } from 'lucide-react';

/**
 * Visualizador completo de una guía de refuerzo
 * 
 * Muestra:
 * - Header de la guía
 * - Tabs para navegar entre las 8 secciones
 * - Contenido Markdown de cada sección
 * - Navegación anterior/siguiente
 * - Enlace al protocolo operativo relacionado
 */
const GuideViewer = () => {
  const { guia } = useParams<{ guia: string }>();
  const navigate = useNavigate();
  
  if (!guia) {
    return <Navigate to="/guia-refuerzo" replace />;
  }

  const guide = getGuide(guia);
  
  if (!guide) {
    return <Navigate to="/guia-refuerzo" replace />;
  }

  // Obtener relaciones bidireccionales
  const relations = getGuideRelations(guia);

  // Sincronizar tab con URL si hay parámetro de sección
  const { numero } = useParams<{ numero?: string }>();
  const initialTab = numero ? numero : '1';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Actualizar tab si cambia la URL
  useEffect(() => {
    if (numero) {
      setActiveTab(numero);
    }
  }, [numero]);

  return (
    <div className="space-y-6">
      <BackButton to="/guia-refuerzo" label="Volver a Guías" />
      
      <GuideHeader guide={guide} />

      {/* Enlaces Bidireccionales: Protocolo y Manual */}
      {(relations.protocol || relations.manual) && (
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border bg-card border border-border rounded-lg p-4">
          {relations.protocol && relations.mapping && 'protocoloRuta' in relations.mapping && relations.mapping.protocoloRuta && (
            <Link
              to={relations.mapping.protocoloRuta}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary transition-colors font-medium text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>📋 Ver Protocolo Operativo</span>
              {relations.protocol && (
                <span className="text-xs opacity-75">({relations.protocol.title})</span>
              )}
            </Link>
          )}
          {relations.manual && (
            <Link
              to={relations.manual.ruta || '#'}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 transition-colors font-medium text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>📘 Ver Manual Completo</span>
            </Link>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 overflow-x-auto">
          {guide.secciones.map((section) => (
            <TabsTrigger 
              key={section.numero} 
              value={section.numero.toString()}
              className="text-xs"
            >
              {section.numero}
            </TabsTrigger>
          ))}
        </TabsList>

        {guide.secciones.map((section) => (
          <TabsContent key={section.numero} value={section.numero.toString()} className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {section.titulo}
              </h2>
              <GuideMarkdownViewer filePath={section.ruta} />
              <GuideNavigation guideId={guia} currentSection={section.numero} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GuideViewer;

