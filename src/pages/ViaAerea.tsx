import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wind, AlertTriangle, ChevronRight, Baby, Users, Check, RotateCcw, GraduationCap, BookOpen, Cloud } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { getMappingByProtocolId } from '@/data/protocol-guide-manual-mapping';
import { useProtocolAdapter } from '@/services/content-adapter';
import { useProtocolRelations } from '@/hooks/useProtocolRelations';
import NotFound from '@/components/NotFound';
import PageLoader from '@/components/ui/PageLoader';
import { isSuccessState, isErrorState } from '@/types/data-states';

// Pasos de la checklist OVACE (hardcoded, no desde datos)
// IMPORTANTE: Estos pasos son específicos para uso durante emergencia real
const ovaceChecklistSteps = [
  'Valoración inicial (leve/grave)',
  'Obstrucción leve: animar a toser',
  'Obstrucción grave: 5 golpes interescapulares',
  '5 compresiones abdominales (Heimlich)',
  'Alternar golpes + compresiones',
  'Si pierde consciencia: activar 112',
  'Revisar boca antes de ventilar',
  'Extraer objeto visible si se ve',
  'Iniciar RCP si pierde consciencia',
  'Derivar tras maniobras',
];

const ViaAerea = () => {
  // Estado para modo checklist
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  // Estado para checkboxes marcados (Set de índices)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // Integración ContentAdapter: Usar hook con ContentAdapter
  const { protocol: ovace, isLoading, isExternal } = useProtocolAdapter('obstruccion-via-aerea');
  
  // El protocolo viene del ContentAdapter (con fallback automático a local)
  const ovaceFinal = ovace;
  
  // Relaciones bidireccionales usando hook seguro con estados explícitos
  const relationsOVACEState = useProtocolRelations('obstruccion-via-aerea');
  
  // Mapeo formativo (Fase B2) - mantener para compatibilidad
  const mappingOVACE = getMappingByProtocolId('obstruccion-via-aerea');

  // Guard clauses: verificar estados de carga de relaciones
  if (relationsOVACEState.status === 'loading') {
    return <PageLoader />;
  }

  if (relationsOVACEState.status === 'error') {
    return (
      <NotFound 
        message="Error al cargar relaciones del protocolo de Vía Aérea"
        backTo="/"
      />
    );
  }

  // Extraer datos de relaciones (garantizado que existen después de guard clauses)
  const relationsOVACE = isSuccessState(relationsOVACEState) ? relationsOVACEState.data : null;

  // Guard clause: protocolo obligatorio para renderizar contenido
  if (!ovaceFinal || !ovaceFinal.id) {
    return (
      <NotFound
        message="Protocolo de Vía Aérea / OVACE no encontrado"
        backTo="/"
      />
    );
  }

  return (
    <div className="space-y-6">
      <BackButton to="/" label="Volver al inicio" />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Wind className="w-7 h-7 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-foreground">Vía Aérea</h1>
              {isExternal && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md">
                  <Cloud className="w-3 h-3" />
                  Externo
                </span>
              )}
            </div>
            <p className="text-muted-foreground">OVACE (Obstrucción de Vía Aérea por Cuerpo Extraño) e IOT</p>
          </div>
        </div>

        {/* Botón Toggle Modo Checklist */}
        <button
          onClick={() => {
            setIsChecklistMode(!isChecklistMode);
            // Reiniciar checkboxes al activar modo
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
      </div>

      {/* Modo Checklist */}
      {isChecklistMode && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Checklist OVACE - Marca los pasos completados
            </h2>
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
            {ovaceChecklistSteps.map((step, index) => {
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
              {checkedItems.size} de {ovaceChecklistSteps.length} pasos completados
            </p>
          </div>
        </div>
      )}

      {/* Valoración Inicial */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Valoración Inicial</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Obstrucción LEVE
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Puede toser con fuerza</li>
              <li>✓ Puede hablar</li>
              <li>✓ Respiración presente</li>
              <li>✓ Coloración normal</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-green-500/30">
              <div className="text-sm font-medium text-foreground">Actuación:</div>
              <div className="text-sm text-muted-foreground">Animar a toser, vigilar estrechamente</div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Obstrucción GRAVE
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✗ No puede toser</li>
              <li>✗ No puede hablar</li>
              <li>✗ Respiración ausente o débil</li>
              <li>✗ Cianosis</li>
              <li>✗ Pérdida de consciencia inminente</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-red-500/30">
              <div className="text-sm font-medium text-foreground">Actuación:</div>
              <div className="text-sm text-muted-foreground">Maniobras de desobstrucción INMEDIATAS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocolo OVACE */}
      {ovaceFinal && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Protocolo OVACE</h2>
            <span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
              Crítico
            </span>
          </div>

          {/* Puentes Formativos - Fase B2 - Enlaces Bidireccionales */}
          {/* Cláusula de guarda: verificar que relationsOVACE existe antes de acceder */}
          {relationsOVACE && (relationsOVACE.guide || relationsOVACE.manual) && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
              {relationsOVACE.guide && (
                <Link
                  to={`/guia-refuerzo/${mappingOVACE?.guiaId || relationsOVACE?.guide?.id || ''}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors font-medium text-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>🎓 Ver Guía Formativa</span>
                  {relationsOVACE.guide.titulo && (
                    <span className="text-xs opacity-75">({relationsOVACE.guide.titulo})</span>
                  )}
                </Link>
              )}
              {relationsOVACE.manual && relationsOVACE.manual.ruta && (
                <Link
                  to={relationsOVACE.manual.ruta}
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
                {ovaceFinal.steps.map((step, index) => (
                  <li key={index} className="text-foreground pl-2">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {(ovaceFinal.warnings?.length ?? 0) > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Advertencias Importantes</h3>
                <ul className="space-y-1">
                  {(ovaceFinal.warnings ?? []).map((warning, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ovaceFinal.keyPoints && ovaceFinal.keyPoints.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Puntos Clave</h3>
                <ul className="space-y-1">
                  {ovaceFinal.keyPoints.map((point, index) => (
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
      )}

      {/* Variaciones por Edad */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Variaciones por Edad</h2>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Adultos y Niños (&gt;1 año)
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 5 golpes interescapulares</li>
              <li>• 5 compresiones abdominales (Heimlich)</li>
              <li>• Alternar hasta resolución o pérdida de consciencia</li>
              <li>• En embarazadas/obesos: compresiones torácicas en lugar de abdominales</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Baby className="w-4 h-4" />
              Lactantes (&lt;1 año)
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 5 golpes en la espalda (posición boca abajo sobre antebrazo)</li>
              <li>• 5 compresiones torácicas (posición boca arriba sobre antebrazo)</li>
              <li>• Alternar hasta resolución o pérdida de consciencia</li>
              <li>• NO hacer compresiones abdominales (riesgo de lesión)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Si Pierde Consciencia */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Si Pierde Consciencia
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Tumbar al paciente con control</li>
          <li>Activar 112 si no se ha hecho</li>
          <li>Antes de ventilar: revisar boca y extraer objeto visible</li>
          <li>Iniciar RCP inmediatamente (ver protocolo RCP)</li>
          <li>Antes de cada ventilación: revisar boca</li>
        </ol>
      </div>

      {/* IOT (Intubación Orotraqueal) */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Intubación Orotraqueal (IOT)</h2>
        <p className="text-muted-foreground">
          La IOT es un procedimiento avanzado que requiere formación específica y certificación.
          Consulta el manual completo para detalles técnicos y consideraciones especiales.
        </p>
        <Link
          to="/manual"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Ver Manual Completo
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Enlaces relacionados */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">Protocolos Relacionados</h3>
        <div className="space-y-2">
          <Link
            to="/rcp"
            className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-foreground">RCP (si pierde consciencia)</span>
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
  );
};

export default ViaAerea;
