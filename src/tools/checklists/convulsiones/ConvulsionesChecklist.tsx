import { useEffect, useState } from 'react';
import { usePatientSafe } from '@/clinical/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDuration, getElapsedSeconds } from '../sepsis/timers';
import { convulsionesChecklistSteps } from './convulsionesChecklist.model';

const STORAGE_KEY = 'checklist_convulsiones_v1';

interface ConvulsionesChecklistState {
  startedAt: number | null;
  completed: Record<string, boolean>;
  manualWeightKg?: number;
}

const initialState: ConvulsionesChecklistState = {
  startedAt: null,
  completed: {},
  manualWeightKg: undefined,
};

const loadState = (): ConvulsionesChecklistState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as ConvulsionesChecklistState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

const saveState = (state: ConvulsionesChecklistState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silencioso
  }
};

const ConvulsionesChecklist = () => {
  const { patient, hasPatientProperty } = usePatientSafe();
  const [checklistState, setChecklistState] = useState<ConvulsionesChecklistState>(initialState);
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
  const midazolamDoseMg = weightKg ? Math.min(0.2 * weightKg, 10) : null;

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
        <h1 className="text-xl font-semibold text-foreground">Checklist Convulsiones</h1>
        <p className="text-sm text-muted-foreground">
          Control de tiempos y soporte vital en crisis convulsiva.
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
            Inicia el temporizador al inicio de la crisis.
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
          <CardTitle className="text-base">Calculo rapido midazolam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-border/60 bg-muted/30 p-3 space-y-2">
            <Label>Peso (kg)</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={weightKg ?? ''}
              onChange={(event) => handleManualWeight(event.target.value)}
              placeholder="Ej: 25"
            />
            <div className="text-sm text-muted-foreground">
              {midazolamDoseMg
                ? `Dosis IN/BUC: ${midazolamDoseMg.toFixed(2)} mg (0.2 mg/kg, max 10 mg).`
                : 'Introduce el peso para calcular dosis inicial (0.2 mg/kg).'}
            </div>
          </div>
        </CardContent>
      </Card>

      {convulsionesChecklistSteps.map((step) => (
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

export default ConvulsionesChecklist;
