import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Baby, Brain, Heart, Shield, Wind, Zap, Skull, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmergencyButton from '@/components/ui/EmergencyButton';
import { featureFlags } from '@/config/featureFlags';

type EmergencyLayer = 'criticos' | 'apoyo';

const Urgencias = () => {
  const [layer, setLayer] = useState<EmergencyLayer>('criticos');

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Modo Urgencias</h1>
        <p className="text-sm text-muted-foreground">
          Acceso rápido por capas. Prioriza protocolos críticos en 1 toque.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={layer === 'criticos' ? 'default' : 'outline'}
          onClick={() => setLayer('criticos')}
        >
          Capa 1: Críticos
        </Button>
        <Button
          type="button"
          variant={layer === 'apoyo' ? 'default' : 'outline'}
          onClick={() => setLayer('apoyo')}
        >
          Capa 2: Apoyo
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Salir</Link>
        </Button>
      </div>

      {layer === 'criticos' && (
        <section className="space-y-3">
          <h2 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
            Acceso crítico
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <EmergencyButton
              to="/rcp"
              icon={Heart}
              title="RCP / Parada"
              subtitle="Adulto y Pediátrico"
              variant="critical"
            />
            <EmergencyButton
              to="/via-aerea"
              icon={Wind}
              title="Vía Aérea"
              subtitle="OVACE / IOT"
              variant="critical"
            />
            <EmergencyButton
              to="/ictus"
              icon={Brain}
              title="Código Ictus"
              variant="high"
            />
            <EmergencyButton
              to="/shock"
              icon={Zap}
              title="Shock"
              subtitle="Hemorrágico / Séptico"
              variant="high"
            />
            {featureFlags.pathways && (
              <EmergencyButton
                to="/pathways/shock-septico"
                icon={Zap}
                title="Pathway Shock Séptico"
                subtitle="Flujo guiado"
                variant="medium"
              />
            )}
            <EmergencyButton
              to="/escena"
              icon={Shield}
              title="Triage / Escena"
              variant="medium"
            />
            <EmergencyButton
              to="/escena?tab=triage"
              icon={Shield}
              title="MCI / Triage"
              subtitle="START rápido"
              variant="critical"
            />
            <EmergencyButton
              to="/checklists/anafilaxia"
              icon={AlertTriangle}
              title="Anafilaxia"
              subtitle="IM inmediata"
              variant="critical"
            />
            <EmergencyButton
              to="/checklists/intoxicaciones"
              icon={Skull}
              title="Intoxicaciones"
              subtitle="Opioides / BZD"
              variant="high"
            />
            <EmergencyButton
              to="/checklists/parto"
              icon={Baby}
              title="Parto"
              subtitle="Extrahospitalario"
              variant="high"
            />
            <EmergencyButton
              to="/checklists/convulsiones"
              icon={AlertTriangle}
              title="Convulsiones"
              subtitle="Crisis > 5 min"
              variant="high"
            />
            <EmergencyButton
              to="/checklists/termicas"
              icon={Flame}
              title="Hipo/Hipertermia"
              subtitle="Manejo inicial"
              variant="medium"
            />
          </div>
        </section>
      )}

      {layer === 'apoyo' && (
        <section className="space-y-3">
          <h2 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
            Apoyo rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featureFlags.interactiveChecklists && (
              <>
                <Link
                  to="/checklists/sepsis"
                  className="block card-procedure hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[hsl(var(--emergency-high))]" />
                    <div>
                      <h3 className="font-semibold text-foreground">Checklist Sepsis</h3>
                      <p className="text-sm text-muted-foreground">
                        Temporizadores y fluidos
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/checklists/ictus"
                  className="block card-procedure hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[hsl(var(--emergency-medium))]" />
                    <div>
                      <h3 className="font-semibold text-foreground">Checklist Ictus</h3>
                      <p className="text-sm text-muted-foreground">
                        Tiempos clave
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/checklists/parada"
                  className="block card-procedure hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[hsl(var(--emergency-high))]" />
                    <div>
                      <h3 className="font-semibold text-foreground">Checklist Parada</h3>
                      <p className="text-sm text-muted-foreground">
                        RCP y control de tiempos
                      </p>
                    </div>
                  </div>
                </Link>
              </>
            )}
            {featureFlags.vitalsDashboard && (
              <Link
                to="/advanced/vitals"
                className="block card-procedure hover:border-primary/50"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Panel de constantes</h3>
                    <p className="text-sm text-muted-foreground">
                      MAP, qSOFA, NEWS2
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {featureFlags.advancedTools && (
              <Link
                to="/advanced/broselow"
                className="block card-procedure hover:border-primary/50"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Broselow</h3>
                    <p className="text-sm text-muted-foreground">
                      Pediatría rápida
                    </p>
                  </div>
                </div>
              </Link>
            )}
            <Link to="/herramientas" className="block card-procedure hover:border-primary/50">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-foreground">Herramientas</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculadoras y tablas
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Urgencias;
