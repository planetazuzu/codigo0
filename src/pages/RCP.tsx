import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, AlertTriangle, Clock, Users, Baby, Check, RotateCcw, Pill, GraduationCap, BookOpen } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { getMappingByProtocolId } from '@/data/protocol-guide-manual-mapping';
import { getAllDrugs, getDrug, useProtocolAdapter, getProtocol } from '@/services/content-adapter';
import { useProtocolRelations } from '@/hooks/useProtocolRelations';
import NotFound from '@/components/NotFound';
import PageLoader from '@/components/ui/PageLoader';
import { isSuccessState } from '@/types/data-states';
import type { Drug } from '@/data/drugs';

// Pasos de la checklist RCP (hardcoded, no desde datos)
// IMPORTANTE: Estos pasos son específicos para uso durante emergencia real
const rcpChecklistSteps = [
  'Seguridad de la escena',
  'Comprobación de respuesta',
  'Apertura de vía aérea',
  'Comprobación de respiración (<10s)',
  'Activación de emergencias',
  'Inicio de compresiones',
  'Colocación del DEA',
  'Análisis y descarga si indicada',
  'RCP de alta calidad continua',
  'Reevaluación cada 2 minutos',
];

// Helper: Buscar fármaco por nombre (case-insensitive, busca en genericName)
// Usa ContentAdapter para obtener fármacos
const findDrugByName = (drugName: string): Drug | undefined => {
  if (!drugName || typeof drugName !== 'string' || drugName.trim().length === 0) {
    return undefined;
  }
  const normalizedName = drugName.toLowerCase().trim();
  const allDrugs = getAllDrugs();
  if (!allDrugs || allDrugs.length === 0) {
    return undefined;
  }
  return allDrugs.find(
    (drug) => {
      if (!drug || typeof drug !== 'object' || !drug.genericName) return false;
      return (
        drug.genericName.toLowerCase().includes(normalizedName) ||
        drug.genericName.toLowerCase().split('(')[0].trim() === normalizedName ||
        (drug.tradeName != null && drug.tradeName.toLowerCase().includes(normalizedName))
      );
    }
  );
};

const RCP = () => {
  const [activeTab, setActiveTab] = useState<'adulto' | 'pediatrico'>('adulto');
  // Estado para modo checklist (solo RCP Adulto SVB)
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  // Estado para checkboxes marcados (Set de índices)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // Integración Content Pack: Usar hooks para obtener protocolos con override
  const { protocol: rcpAdulto, isLoading: loadingSVB, isExternal: svbIsExternal } = useProtocolAdapter('rcp-adulto-svb');
  const { protocol: rcpAdultoSVA, isLoading: loadingSVA, isExternal: svaIsExternal } = useProtocolAdapter('rcp-adulto-sva');
  const { protocol: rcpPediatrico, isLoading: loadingPed, isExternal: pedIsExternal } = useProtocolAdapter('rcp-pediatrico');

  // Fallback a datos locales si no hay protocolo (compatibilidad)
  const rcpAdultoFinal = rcpAdulto || getProtocol('rcp-adulto-svb');
  const rcpAdultoSVAFinal = rcpAdultoSVA || getProtocol('rcp-adulto-sva');
  const rcpPediatricoFinal = rcpPediatrico || getProtocol('rcp-pediatrico');

  // Relaciones bidireccionales usando hooks seguros con estados explícitos
  const relationsSVBState = useProtocolRelations('rcp-adulto-svb');
  const relationsSVAState = useProtocolRelations('rcp-adulto-sva');
  const relationsPediatricoState = useProtocolRelations('rcp-pediatrico');

  // Mapeos formativos (Fase B2) - mantener para compatibilidad
  // Cláusula de guarda: validar que los mapeos existen antes de usar
  const mappingSVB = getMappingByProtocolId('rcp-adulto-svb');
  const mappingSVA = getMappingByProtocolId('rcp-adulto-sva');
  const mappingPediatrico = getMappingByProtocolId('rcp-pediatrico');

  // Guard clauses: verificar estados de carga de relaciones
  if (relationsSVBState.status === 'loading' || relationsSVAState.status === 'loading' || relationsPediatricoState.status === 'loading') {
    return <PageLoader />;
  }

  if (relationsSVBState.status === 'error' || relationsSVAState.status === 'error' || relationsPediatricoState.status === 'error') {
    return (
      <NotFound 
        message="Error al cargar relaciones de protocolos RCP"
        backTo="/"
      />
    );
  }

  // Extraer datos de relaciones (garantizado que existen después de guard clauses)
  const relationsSVB = isSuccessState(relationsSVBState) ? relationsSVBState.data : null;
  const relationsSVA = isSuccessState(relationsSVAState) ? relationsSVAState.data : null;
  const relationsPediatrico = isSuccessState(relationsPediatricoState) ? relationsPediatricoState.data : null;

  // Obtener fármacos con dosis para RCP SVA
  const svaDrugsWithDoses = rcpAdultoSVAFinal?.drugs
    ?.map((drugName) => {
      const drug = findDrugByName(drugName);
      return drug ? { name: drugName, drug } : null;
    })
    .filter((item): item is { name: string; drug: Drug } => item !== null) || [];

  // Limpiar estado de checklist al cambiar de tab
  const handleTabChange = (tab: 'adulto' | 'pediatrico') => {
    setActiveTab(tab);
    setIsChecklistMode(false);
    setCheckedItems(new Set());
  };

  return (
    <div className="space-y-6">
      <BackButton to="/" label="Volver al inicio" />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">RCP / Parada Cardiorrespiratoria</h1>
            <p className="text-muted-foreground">Protocolo de Reanimación Cardiopulmonar</p>
          </div>
        </div>

        {/* Tabs Adulto/Pediátrico */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => handleTabChange('adulto')}
            aria-selected={activeTab === 'adulto'}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'adulto'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Adulto</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('pediatrico')}
            aria-selected={activeTab === 'pediatrico'}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pediatrico'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4" />
              <span>Pediátrico</span>
            </div>
          </button>
        </div>
      </div>

      {/* Contenido Adulto */}
      {activeTab === 'adulto' && (
        <div className="space-y-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-6 lg:items-start">
          {/* Columna Principal */}
          <div className="space-y-6">
          {/* SVB */}
          {rcpAdultoFinal && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Soporte Vital Básico (SVB)</h2>
                <span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                  Crítico
                </span>
              </div>

              {/* Puentes Formativos - Fase B2 - Enlaces Bidireccionales (Móvil/Tablet) */}
              {/* Cláusula de guarda: verificar que relationsSVB existe y tiene datos */}
              {relationsSVB && (relationsSVB.guide || relationsSVB.manual) && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border lg:hidden">
                  {relationsSVB.guide && (
                    <Link
                      to={`/guia-refuerzo/${mappingSVB?.guiaId || relationsSVB.guide?.id || ''}`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors font-medium text-sm"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>🎓 Ver Guía Formativa</span>
                      {relationsSVB.guide.titulo && (
                        <span className="text-xs opacity-75">({relationsSVB.guide.titulo})</span>
                      )}
                    </Link>
                  )}
                  {relationsSVB.manual && relationsSVB.manual.ruta && (
                    <Link
                      to={relationsSVB?.manual?.ruta ?? '#'}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 transition-colors font-medium text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>📘 Ver Manual Completo</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Botón Toggle Modo Checklist */}
              <button
                onClick={() => {
                  setIsChecklistMode(!isChecklistMode);
                  // Reiniciar checkboxes al cambiar de modo
                  if (!isChecklistMode) {
                    setCheckedItems(new Set());
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isChecklistMode
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-2 border-green-500/50'
                    : 'bg-muted hover:bg-accent text-foreground border border-border'
                }`}
              >
                <span className="text-lg">🟢</span>
                <span>{isChecklistMode ? 'Modo Checklist Activo' : 'Modo Checklist'}</span>
              </button>

              <div className="space-y-4">
                {/* Modo Checklist */}
                {isChecklistMode ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        Checklist RCP - Marca los pasos completados
                      </h3>
                      {checkedItems.size > 0 && (
                        <button
                          onClick={() => setCheckedItems(new Set())}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reiniciar
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {rcpChecklistSteps.map((step, index) => {
                        const isChecked = checkedItems.has(index);
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              const newChecked = new Set(checkedItems);
                              if (isChecked) {
                                newChecked.delete(index);
                              } else {
                                newChecked.add(index);
                              }
                              setCheckedItems(newChecked);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                              isChecked
                                ? 'bg-green-500/10 border-green-500/50'
                                : 'bg-muted border-border hover:border-primary/50'
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isChecked
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-card border-muted-foreground'
                              }`}
                            >
                              {isChecked ? (
                                <Check className="w-6 h-6 text-white" />
                              ) : (
                                <span className="text-muted-foreground font-bold text-lg">{index + 1}</span>
                              )}
                            </div>
                            <span
                              className={`flex-1 font-medium ${
                                isChecked ? 'text-foreground line-through opacity-60' : 'text-foreground'
                              }`}
                            >
                              {step}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        {checkedItems.size} de {rcpChecklistSteps.length} pasos completados
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Modo Normal - Pasos del Protocolo */
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Pasos del Protocolo
                    </h3>
                    <ol className="space-y-2 list-decimal list-inside">
                      {rcpAdultoFinal.steps.map((step, index) => (
                        <li key={index} className="text-foreground pl-2">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {rcpAdultoFinal.warnings && rcpAdultoFinal.warnings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Advertencias Importantes
                    </h3>
                    <ul className="space-y-1">
                      {rcpAdultoFinal.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rcpAdultoFinal.keyPoints && rcpAdultoFinal.keyPoints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Puntos Clave</h3>
                    <ul className="space-y-1">
                      {rcpAdultoFinal.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rcpAdultoFinal.equipment && rcpAdultoFinal.equipment.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Material Necesario</h3>
                    <div className="flex flex-wrap gap-2">
                      {rcpAdultoFinal.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-muted rounded-full text-sm text-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SVA */}
          {rcpAdultoSVAFinal && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Soporte Vital Avanzado (SVA)</h2>
                <span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                  Crítico
                </span>
              </div>

              {/* Puentes Formativos - Fase B2 */}
              {mappingSVA?.tieneManual && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                  <Link
                    to={mappingSVA.manualRuta || '#'}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 transition-colors font-medium text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📘 Ver Manual Completo</span>
                  </Link>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Pasos del Protocolo</h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    {rcpAdultoSVAFinal.steps.map((step, index) => (
                      <li key={index} className="text-foreground pl-2">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {rcpAdultoSVAFinal.warnings && rcpAdultoSVAFinal.warnings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Advertencias</h3>
                    <ul className="space-y-1">
                      {rcpAdultoSVAFinal.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rcpAdultoSVAFinal.keyPoints && rcpAdultoSVAFinal.keyPoints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Puntos Clave</h3>
                    <ul className="space-y-1">
                      {rcpAdultoSVAFinal.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dosis de Fármacos Inline */}
                {svaDrugsWithDoses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      Dosis de Fármacos
                    </h3>
                    <div className="space-y-3">
                      {svaDrugsWithDoses.map(({ name, drug }) => {
                        // Guard clause: verificar que drug existe
                        if (!drug || !drug.id) return null;
                        return (
                          <div
                            key={drug.id || name}
                            className="bg-muted/50 border border-border rounded-lg p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-foreground">{drug.genericName || name}</h4>
                              {drug.tradeName && (
                                <span className="text-xs text-muted-foreground">{drug.tradeName}</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Dosis Adulto: </span>
                                <span className="text-sm text-foreground font-medium">{drug.adultDose || 'N/A'}</span>
                              </div>
                              {drug.pediatricDose && (
                                <div>
                                  <span className="text-sm font-medium text-muted-foreground">Dosis Pediátrica: </span>
                                  <span className="text-sm text-foreground font-medium">{drug.pediatricDose}</span>
                                </div>
                              )}
                              {drug.routes && drug.routes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {drug.routes.map((route) => (
                                    <span
                                      key={route}
                                      className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium"
                                    >
                                      {route}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {drug.dilution && (
                                <div className="mt-2 pt-2 border-t border-border">
                                  <span className="text-xs text-muted-foreground">Dilución: </span>
                                  <span className="text-xs text-foreground">{drug.dilution}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>

          {/* Sidebar Desktop - Información Relacionada */}
          <div className="hidden lg:block space-y-4 lg:sticky lg:top-20">
            {/* Enlaces relacionados */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3">Protocolos Relacionados</h3>
              <div className="space-y-2">
                <Link
                  to="/via-aerea"
                  className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="text-foreground">Vía Aérea / OVACE</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
                <Link
                  to="/soporte-vital"
                  className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="text-foreground">Ver todos los protocolos de Soporte Vital</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* Guías y Manual - Desktop Sidebar */}
            {/* Cláusula de guarda: verificar que relationsSVB existe antes de acceder */}
            {relationsSVB && (relationsSVB?.guide || relationsSVB?.manual) && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-foreground mb-2">Contenido Relacionado</h3>
                {relationsSVB?.guide && (
                  <Link
                    to={`/guia-refuerzo/${mappingSVB?.guiaId || (relationsSVB?.guide && typeof relationsSVB.guide === 'object' && 'id' in relationsSVB.guide ? relationsSVB.guide.id : '') || ''}`}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors text-sm"
                  >
                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs">Guía Formativa</span>
                  </Link>
                )}
                {relationsSVB?.manual?.ruta && (
                  <Link
                    to={relationsSVB?.manual?.ruta ?? '#'}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 transition-colors text-sm"
                  >
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs">Manual Completo</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Enlaces relacionados - Móvil/Tablet (mantener visible) */}
          <div className="lg:hidden bg-muted/50 border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Protocolos Relacionados</h3>
            <div className="space-y-2">
              <Link
                to="/via-aerea"
                className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-foreground">Vía Aérea / OVACE</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
              <Link
                to="/soporte-vital"
                className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-foreground">Ver todos los protocolos de Soporte Vital</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Pediátrico */}
      {activeTab === 'pediatrico' && rcpPediatricoFinal && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">RCP Pediátrico</h2>
              <span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                Crítico
              </span>
            </div>

            {/* Puentes Formativos - Fase B2 */}
            {/* Cláusula de guarda: verificar que relationsPediatrico existe antes de acceder */}
            {relationsPediatrico && (relationsPediatrico?.guide || relationsPediatrico?.manual) && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                {relationsPediatrico?.guide && (
                  <Link
                    to={`/guia-refuerzo/${mappingPediatrico?.guiaId || relationsPediatrico?.guide?.id || ''}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors font-medium text-sm"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>🎓 Ver Guía Formativa</span>
                    {relationsPediatrico?.guide?.titulo && (
                      <span className="text-xs opacity-75">({relationsPediatrico.guide.titulo})</span>
                    )}
                  </Link>
                )}
                {relationsPediatrico?.manual?.ruta && (
                  <Link
                    to={relationsPediatrico?.manual?.ruta ?? '#'}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 transition-colors font-medium text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📘 Ver Manual Completo</span>
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Pasos del Protocolo
                </h3>
                <ol className="space-y-2 list-decimal list-inside">
                  {rcpPediatricoFinal.steps.map((step, index) => (
                    <li key={index} className="text-foreground pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {rcpPediatricoFinal.warnings && rcpPediatricoFinal.warnings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Advertencias Importantes</h3>
                  <ul className="space-y-1">
                    {rcpPediatricoFinal.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {rcpPediatricoFinal.keyPoints && rcpPediatricoFinal.keyPoints.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Puntos Clave</h3>
                  <ul className="space-y-1">
                    {rcpPediatricoFinal.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Enlaces relacionados */}
          <div className="bg-muted/50 border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Protocolos Relacionados</h3>
            <div className="space-y-2">
              <Link
                to="/via-aerea"
                className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-foreground">OVACE Pediátrico</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RCP;
