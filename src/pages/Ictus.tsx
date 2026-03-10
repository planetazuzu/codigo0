import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, AlertTriangle, ChevronRight, Phone, Check, RotateCcw, GraduationCap, BookOpen } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { getMappingByProtocolId } from '@/data/protocol-guide-manual-mapping';
import { getProcedureById } from '@/data/procedures';

const Ictus = () => {
  // Obtener protocolo Ictus desde procedures.ts
  const ictusProtocol = getProcedureById('ictus');
  
  // Cláusula de guarda: verificar que el protocolo existe antes de usar
  if (!ictusProtocol) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold text-foreground">
          Protocolo de Ictus no encontrado
        </h2>
        <p className="text-muted-foreground">
          El protocolo solicitado no está disponible en este momento.
        </p>
        <BackButton to="/" label="Volver al inicio" />
      </div>
    );
  }
  
  // Pasos de la checklist desde el protocolo operativo
  // Ahora es seguro acceder porque ya validamos que existe
  const ictusChecklistSteps = ictusProtocol.steps ?? [];

  // Estado para modo checklist
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  // Estado para checkboxes marcados (Set de índices)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // Ruta al manual transtelefónico
  const manualRutaIctus = '/manual/parte-v-protocolos/bloque-5-transtelefonicos/5.1.4';

  return (
    <div className="space-y-6">
      <BackButton to="/" label="Volver al inicio" />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Brain className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Código Ictus</h1>
            <p className="text-muted-foreground">Protocolo de activación ante sospecha de ictus agudo</p>
          </div>
        </div>

        {/* Alerta de tiempo */}
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-1">
              ⏱️ TIEMPO ES CEREBRO
            </h3>
            <p className="text-sm text-muted-foreground">
              Cada minuto cuenta. La activación precoz del Código Ictus mejora significativamente el pronóstico.
            </p>
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
          aria-label={isChecklistMode ? 'Desactivar modo checklist' : 'Activar modo checklist'}
          aria-pressed={isChecklistMode}
        >
          <span className="text-lg">🟢</span>
          <span>{isChecklistMode ? 'Modo Checklist Activo' : 'Modo Checklist'}</span>
        </button>

        {/* Puentes Formativos - Fase B2 */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Link
            to={manualRutaIctus}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-600 dark:text-purple-400 transition-colors font-medium text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>📘 Ver Manual Completo</span>
          </Link>
        </div>
      </div>

      {/* Modo Checklist */}
      {isChecklistMode && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Checklist Código Ictus - Marca los pasos completados
            </h2>
            {checkedItems.size > 0 && (
              <button
                onClick={() => setCheckedItems(new Set())}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Reiniciar checklist y desmarcar todos los pasos"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </button>
            )}
          </div>
          <div className="space-y-2">
            {ictusChecklistSteps.map((step, index) => {
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
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left active:scale-[0.98] ${
                    isChecked
                      ? 'bg-green-500/20 border-green-500 shadow-sm'
                      : 'bg-muted border-border hover:border-primary/50 active:bg-accent'
                  }`}
                  aria-label={isChecked ? `Desmarcar paso ${index + 1}: ${step}` : `Marcar paso ${index + 1}: ${step}`}
                  aria-checked={isChecked}
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
              {checkedItems.size} de {ictusChecklistSteps.length} pasos completados
            </p>
          </div>
        </div>
      )}

      {/* Test FAST */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Reconocimiento: Test FAST
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">F</div>
            <div className="font-semibold text-foreground mb-1">Face (Cara)</div>
            <div className="text-sm text-muted-foreground">Asimetría facial al sonreír</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">A</div>
            <div className="font-semibold text-foreground mb-1">Arms (Brazos)</div>
            <div className="text-sm text-muted-foreground">Debilidad en un brazo al elevarlo</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">S</div>
            <div className="font-semibold text-foreground mb-1">Speech (Habla)</div>
            <div className="text-sm text-muted-foreground">Dificultad para hablar o entender</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">T</div>
            <div className="font-semibold text-foreground mb-1">Time (Tiempo)</div>
            <div className="text-sm text-muted-foreground">Activar Código Ictus INMEDIATAMENTE</div>
          </div>
        </div>
      </div>

      {/* Protocolo de Actuación */}
      {ictusProtocol && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Protocolo de Actuación</h2>

          <div className="space-y-3">
            {ictusProtocol.steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{step}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Advertencias del protocolo */}
          {ictusProtocol.warnings && ictusProtocol.warnings.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Advertencias Críticas
              </h3>
              <ul className="space-y-2">
                {ictusProtocol.warnings?.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-yellow-500 mt-1">⚠️</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Puntos clave del protocolo */}
          {ictusProtocol.keyPoints && ictusProtocol.keyPoints.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3">Puntos Clave</h3>
              <ul className="space-y-2">
                {ictusProtocol.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipamiento y fármacos */}
          {(ictusProtocol.equipment || ictusProtocol.drugs) && (
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              {ictusProtocol.equipment && ictusProtocol.equipment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Equipamiento</h3>
                  <ul className="space-y-1">
                    {ictusProtocol.equipment?.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {ictusProtocol.drugs && ictusProtocol.drugs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Fármacos</h3>
                  <ul className="space-y-1">
                    {ictusProtocol.drugs?.map((drug, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {drug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Criterios de Exclusión */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Criterios de Exclusión</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-red-500 mt-1">✗</span>
            <span>Síntomas &gt;24 horas de evolución (excepto indicación específica del hospital)</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-red-500 mt-1">✗</span>
            <span>Hipoglucemia como causa de síntomas</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-red-500 mt-1">✗</span>
            <span>Trauma craneal reciente</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-red-500 mt-1">✗</span>
            <span>Paciente en tratamiento anticoagulante con INR &gt;3.0</span>
          </li>
        </ul>
      </div>


      {/* Enlaces relacionados */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">Protocolos Relacionados</h3>
        <div className="space-y-2">
          <Link
            to="/telefono"
            className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Protocolo Transtelefónico de Ictus</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link
            to="/patologias"
            className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-foreground">Ver todas las patologías neurológicas</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link
            to="/rcp"
            className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-foreground">RCP (si pierde consciencia)</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ictus;
