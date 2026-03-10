import { useEffect, useMemo, useState } from 'react';
import { usePatientSafe } from '@/clinical/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sepsisChecklistSteps } from './sepsisChecklist.model';
import { formatDuration, getElapsedSeconds, getRemainingSeconds } from './timers';

const STORAGE_KEY = 'sepsis_checklist_v1';
const FLUIDS_ML_PER_KG = 30;
const ANTIBIOTIC_DEADLINE_SECONDS = 60 * 60;

interface SepsisChecklistState {
  startedAt: number | null;
  completed: Record<string, boolean>;
  manualWeightKg?: number;
}

const initialState: SepsisChecklistState = {
  startedAt: null,
  completed: {},
  manualWeightKg: undefined,
};

const loadState = (): SepsisChecklistState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as SepsisChecklistState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

const saveState = (state: SepsisChecklistState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silencioso para no romper la UI
  }
};

const SepsisChecklist = () => {
  const { patient, hasPatientProperty } = usePatientSafe();
  const [checklistState, setChecklistState] = useState<SepsisChecklistState>(initialState);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    setChecklistState(loadState());
  }, []);

  useEffect(() => {
    saveState(checklistState);
  }, [checklistState]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const startedAt = checklistState.startedAt;
  const elapsedSeconds = getElapsedSeconds(startedAt);
  const remainingAntibiotic = getRemainingSeconds(startedAt, ANTIBIOTIC_DEADLINE_SECONDS);

  // Cláusula de guarda: usar peso del contexto si está disponible, sino el manual
  const weightKg = (hasPatientProperty('weight') && patient.weight) 
    ? patient.weight 
    : checklistState.manualWeightKg;
  const fluidVolume = useMemo(() => {
    if (!weightKg) return null;
    return Math.round(weightKg * FLUIDS_ML_PER_KG);
  }, [weightKg]);

  const toggleStep = (id: string, value: boolean) => {
    setChecklistState((prev) => ({
      ...prev,
      completed: { ...prev.completed, [id]: value },
    }));
  };

  const handleStart = () => {
    if (startedAt) return;
    setChecklistState((prev) => ({ ...prev, startedAt: Date.now() }));
  };

  const handleReset = () => {
    setChecklistState(initialState);
  };

  const handleManualWeight = (value: string) => {
    const parsed = Number(value);
    setChecklistState((prev) => ({
      ...prev,
      manualWeightKg: Number.isFinite(parsed) ? parsed : undefined,
    }));
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Checklist Código Sepsis</h1>
        <p className="text-sm text-muted-foreground">
          Checklist interactiva con temporizador y cálculo de fluidos.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Temporizador</CardTitle>
          <div className="text-sm text-muted-foreground">
            {startedAt ? `Tiempo: ${formatDuration(elapsedSeconds)}` : 'Sin iniciar'}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm">
            {startedAt
              ? `Antibiótico < 1h: ${formatDuration(remainingAntibiotic)}`
              : 'Inicia para contar el tiempo crítico.'}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={!!startedAt}>
              Iniciar
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reiniciar
            </Button>
          </div>
        </CardContent>
      </Card>

      {sepsisChecklistSteps.map((step) => (
        <Card key={step.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={!!checklistState.completed[step.id]}
                onCheckedChange={(value) => toggleStep(step.id, Boolean(value))}
              />
              <CardTitle className="text-base">{step.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{step.description}</p>

            {step.hasFluidCalculator && (
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
                    ? `Volumen recomendado: ${fluidVolume} ml`
                    : 'Introduce el peso para calcular 30 ml/kg.'}
                </div>
              </div>
            )}

            {step.hasAntibioticDeadline && (
              <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
                {startedAt
                  ? `Tiempo restante: ${formatDuration(remainingAntibiotic)}`
                  : 'Inicia el temporizador para activar la cuenta atrás.'}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SepsisChecklist;
