import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatientSafe } from '@/clinical/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { featureFlags } from '@/config/featureFlags';
import { formatDuration, getElapsedSeconds } from '@/tools/checklists/sepsis/timers';
import { shockSepticPathwaySections } from './shockSepticPathway.model';

const STORAGE_KEY = 'pathway_shock_septico_v1';
const FLUIDS_ML_PER_KG = 30;

interface PathwayState {
  startedAt: number | null;
  completed: Record<string, boolean>;
  manualWeightKg?: number;
}

const initialState: PathwayState = {
  startedAt: null,
  completed: {},
  manualWeightKg: undefined,
};

const loadState = (): PathwayState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as PathwayState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

const saveState = (state: PathwayState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silencioso para no romper la UI
  }
};

const ShockSepticPathway = () => {
  const { patient, hasPatientProperty } = usePatientSafe();
  const [pathwayState, setPathwayState] = useState<PathwayState>(initialState);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    setPathwayState(loadState());
  }, []);

  useEffect(() => {
    saveState(pathwayState);
  }, [pathwayState]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const startedAt = pathwayState.startedAt;
  const elapsedSeconds = getElapsedSeconds(startedAt);

  const totalSteps = shockSepticPathwaySections.reduce(
    (acc, section) => acc + section.steps.length,
    0,
  );
  const completedSteps = Object.values(pathwayState.completed).filter(Boolean).length;
  const progressPercent = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Cláusula de guarda: usar peso del contexto si está disponible, sino el manual
  const weightKg = (hasPatientProperty('weight') && patient.weight) 
    ? patient.weight 
    : pathwayState.manualWeightKg;
  const fluidVolume = useMemo(() => {
    if (!weightKg) return null;
    return Math.round(weightKg * FLUIDS_ML_PER_KG);
  }, [weightKg]);

  const toggleStep = (id: string, value: boolean) => {
    setPathwayState((prev) => ({
      ...prev,
      completed: { ...prev.completed, [id]: value },
    }));
  };

  const handleStart = () => {
    if (startedAt) return;
    setPathwayState((prev) => ({ ...prev, startedAt: Date.now() }));
  };

  const handleReset = () => {
    setPathwayState(initialState);
  };

  const handleManualWeight = (value: string) => {
    const parsed = Number(value);
    setPathwayState((prev) => ({
      ...prev,
      manualWeightKg: Number.isFinite(parsed) ? parsed : undefined,
    }));
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Pathway shock séptico</h1>
        <p className="text-sm text-muted-foreground">
          Flujo guiado para reconocimiento, tratamiento inicial y traslado.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Progreso</CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedSteps}/{totalSteps} completados ({progressPercent}%)
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-secondary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              {startedAt ? `Tiempo: ${formatDuration(elapsedSeconds)}` : 'Sin iniciar'}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleStart} disabled={!!startedAt}>
                Iniciar
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reiniciar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cálculo rápido de fluidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-border/60 bg-muted/30 p-3 space-y-2">
            <Label>Peso (kg)</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={weightKg ?? ''}
              onChange={(event) => handleManualWeight(event.target.value)}
              placeholder="Ej: 70"
            />
            <div className="text-sm text-muted-foreground">
              {fluidVolume
                ? `Volumen recomendado: ${fluidVolume} ml (30 ml/kg)`
                : 'Introduce el peso para calcular el bolo de fluidos.'}
            </div>
          </div>
          {featureFlags.vitalsDashboard && (
            <Link
              to="/advanced/vitals"
              className="text-sm text-secondary underline underline-offset-4"
            >
              Abrir panel de constantes
            </Link>
          )}
        </CardContent>
      </Card>

      {shockSepticPathwaySections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">{section.title}</CardTitle>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {section.steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3">
                <Checkbox
                  checked={!!pathwayState.completed[step.id]}
                  onCheckedChange={(value) => toggleStep(step.id, Boolean(value))}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShockSepticPathway;
