export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  hasTimerNote?: boolean;
}

export const ictusChecklistSteps: ChecklistStep[] = [
  {
    id: 'inicio_sintomas',
    title: 'Inicio de síntomas',
    description: 'Registrar hora de inicio o última vez visto normal.',
    hasTimerNote: true,
  },
  {
    id: 'fast',
    title: 'Evaluación FAST / Cincinnati',
    description: 'Cara, brazo, habla: registrar hallazgos.',
  },
  {
    id: 'glucemia',
    title: 'Glucemia capilar',
    description: 'Descartar hipoglucemia.',
  },
  {
    id: 'hta',
    title: 'Constantes y TA',
    description: 'Tomar TA y constantes básicas.',
  },
  {
    id: 'aviso_hospital',
    title: 'Aviso a centro receptor',
    description: 'Prealerta a hospital con código ictus.',
  },
  {
    id: 'traslado',
    title: 'Checklist de traslado',
    description: 'Vía aérea, monitorización y seguridad.',
  },
];
