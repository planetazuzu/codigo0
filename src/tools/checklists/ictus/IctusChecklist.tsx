import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ictusChecklistSteps } from './ictusChecklist.model';
import { formatDuration, getElapsedSeconds } from '../sepsis/timers';

const STORAGE_KEY = 'ictus_checklist_v1';

interface IctusChecklistState {
  startedAt: number | null;
  completed: Record<string, boolean>;
}

const initialState: IctusChecklistState = {
  startedAt: null,
  completed: {},
};

const loadState = (): IctusChecklistState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as IctusChecklistState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

const saveState = (state: IctusChecklistState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silencioso
  }
};

const IctusChecklist = () => {
  const [checklistState, setChecklistState] = useState<IctusChecklistState>(initialState);
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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Checklist Código Ictus</h1>
        <p className="text-sm text-muted-foreground">
          Checklist interactiva con temporizador desde inicio de síntomas.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Tiempo desde inicio</CardTitle>
          <div className="text-sm text-muted-foreground">
            {startedAt ? formatDuration(elapsedSeconds) : 'Sin iniciar'}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            {startedAt ? 'Monitoriza la ventana terapéutica.' : 'Inicia cuando se conozca la hora de inicio.'}
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

      {ictusChecklistSteps.map((step) => (
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
            {step.hasTimerNote && (
              <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
                {startedAt
                  ? `Tiempo transcurrido: ${formatDuration(elapsedSeconds)}`
                  : 'Inicia el temporizador al registrar el inicio.'}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IctusChecklist;
