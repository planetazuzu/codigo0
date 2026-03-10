import { useEffect, useState } from 'react';
import { usePatientSafe } from '@/clinical/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDuration, getElapsedSeconds } from '../sepsis/timers';
import { intoxicacionesChecklistSteps } from './intoxicacionesChecklist.model';

const STORAGE_KEY = 'checklist_intoxicaciones_v1';

interface IntoxicacionesChecklistState {
  startedAt: number | null;
  completed: Record<string, boolean>;
  manualWeightKg?: number;
}

const initialState: IntoxicacionesChecklistState = {
  startedAt: null,
  completed: {},
  manualWeightKg: undefined,
};

const loadState = (): IntoxicacionesChecklistState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as IntoxicacionesChecklistState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

const saveState = (state: IntoxicacionesChecklistState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silencioso
  }
};

const IntoxicacionesChecklist = () => {
  const { patient, hasPatientProperty } = usePatientSafe();
  const [checklistState, setChecklistState] = useState<IntoxicacionesChecklistState>(initialState);
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

  const elapsedSeconds = getElapsedSeconds(checklistState.startedAt);
  // Cláusula de guarda: usar peso del contexto si está disponible, sino el manual
  const weightKg = (hasPatientProperty('weight') && patient.weight) 
    ? patient.weight 
    : checklistState.manualWeightKg;
  const naloxoneDoseMg = weightKg ? Math.min(0.1 * weightKg, 2) : null;

  const toggleStep = (id: string, value: boolean) => {
    setChecklistState((prev) => ({
      ...prev,
      completed: { ...prev.completed, [id]: value },
    }));
  };

  const handleStart = () => {
    if (checklistState.startedAt) return;
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
        <h1 className="text-xl font-semibold text-foreground">Checklist Intoxicaciones</h1>
        <p className="text-sm text-muted-foreground">
          Enfoque ABCDE con antidotos y descontaminacion.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Temporizador</CardTitle>
          <div className="text-sm text-muted-foreground">
            {checklistState.startedAt ? `Tiempo: ${formatDuration(elapsedSeconds)}` : 'Sin iniciar'}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Inicia el temporizador al primer contacto.
          </div>
          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={!!checklistState.startedAt}>
              Iniciar
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reiniciar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Naloxona (orientativo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-border/60 bg-muted/30 p-3 space-y-2">
            <Label>Peso (kg)</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={weightKg ?? ''}
              onChange={(event) => handleManualWeight(event.target.value)}
              placeholder="Ej: 15"
            />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Adulto: dosis inicial 0.4 mg IV/IM/IN, titular según respuesta.</p>
              {naloxoneDoseMg
                ? <p>Pediatría: {naloxoneDoseMg.toFixed(2)} mg (0.1 mg/kg, máx 2 mg).</p>
                : <p>Pediatría: introduce peso para calcular 0.1 mg/kg (máx 2 mg).</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {intoxicacionesChecklistSteps.map((step) => (
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
          <CardContent className="text-sm text-muted-foreground">
            {step.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IntoxicacionesChecklist;
