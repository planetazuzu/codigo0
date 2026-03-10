import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDuration, getElapsedSeconds } from '../sepsis/timers';
import { partoChecklistSteps } from './partoChecklist.model';

const STORAGE_KEY = 'checklist_parto_v1';

interface PartoChecklistState {
  startedAt: number | null;
  completed: Record<string, boolean>;
}

const initialState: PartoChecklistState = {
  startedAt: null,
  completed: {},
};

const loadState = (): PartoChecklistState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as PartoChecklistState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

const saveState = (state: PartoChecklistState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silencioso
  }
};

const PartoChecklist = () => {
  const [checklistState, setChecklistState] = useState<PartoChecklistState>(initialState);
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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Checklist Parto Inminente</h1>
        <p className="text-sm text-muted-foreground">
          Checklist operativa para parto extrahospitalario.
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
            Inicia el temporizador al identificar parto inminente.
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
          <CardTitle className="text-base">Peso RN orientativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Referencia rápida si no se conoce el peso:</p>
          <p>• &lt;34 semanas: ~1.5–2.0 kg</p>
          <p>• 34–36 semanas: ~2.0–2.5 kg</p>
          <p>• ≥37 semanas (a término): ~3.0–3.5 kg</p>
          <p>Si no hay datos, asumir 3.2 kg para cálculos iniciales y ajustar según clínica.</p>
        </CardContent>
      </Card>

      {partoChecklistSteps.map((step) => (
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

export default PartoChecklist;
