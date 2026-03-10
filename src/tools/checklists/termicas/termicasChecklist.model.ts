export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
}

export const termicasChecklistSteps: ChecklistStep[] = [
  {
    id: 'term-abcde',
    title: 'ABCDE y temperatura',
    description: 'Valorar conciencia, via aerea y temperatura central si es posible.',
  },
  {
    id: 'term-hipotermia-grave',
    title: 'Hipotermia grave',
    description:
      'Evitar movimientos bruscos, monitorizar ritmo y preparar traslado urgente.',
  },
  {
    id: 'term-hipotermia',
    title: 'Hipotermia',
    description:
      'Retirar ropa humeda, aislar del suelo, recalentamiento pasivo, manejar suavemente.',
  },
  {
    id: 'term-hipertermia',
    title: 'Hipertermia',
    description:
      'Enfriamiento rapido: sombra, ropa ligera, pulverizar agua, abanicar. Sueros segun protocolo.',
  },
  {
    id: 'term-traslado',
    title: 'Traslado urgente',
    description: 'Monitorizar constantes y comunicar evolucion.',
  },
];
