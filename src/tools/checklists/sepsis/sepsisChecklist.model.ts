export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  hasFluidCalculator?: boolean;
  hasAntibioticDeadline?: boolean;
}

export const sepsisChecklistSteps: ChecklistStep[] = [
  {
    id: 'access',
    title: 'Acceso vascular de gran calibre',
    description: 'Canalizar vía periférica (o alternativa) y preparar perfusión.',
  },
  {
    id: 'fluids',
    title: 'Fluidoterapia 30 ml/kg',
    description: 'Administrar cristaloides en bolo según peso.',
    hasFluidCalculator: true,
  },
  {
    id: 'cultures',
    title: 'Hemocultivos antes de antibióticos',
    description: 'Tomar cultivos según protocolo local.',
  },
  {
    id: 'antibiotics',
    title: 'Antibiótico en < 1 hora',
    description: 'Iniciar antibiótico de amplio espectro.',
    hasAntibioticDeadline: true,
  },
  {
    id: 'vasopressors',
    title: 'Evaluar vasopresores',
    description: 'Si MAP < 65 tras fluidos, considerar noradrenalina.',
  },
  {
    id: 'source',
    title: 'Buscar foco infeccioso',
    description: 'Exploración dirigida y reevaluación clínica.',
  },
];
