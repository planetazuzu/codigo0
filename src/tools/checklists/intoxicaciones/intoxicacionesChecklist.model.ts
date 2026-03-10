export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
}

export const intoxicacionesChecklistSteps: ChecklistStep[] = [
  {
    id: 'intox-abcde',
    title: 'ABCDE inmediato',
    description: 'Asegurar via aerea, ventilacion y perfusion. Glucemia si alteracion mental.',
  },
  {
    id: 'intox-seguridad',
    title: 'Seguridad de escena',
    description: 'Ventilar, usar EPI y evitar exposicion a toxicos.',
  },
  {
    id: 'intox-pistas',
    title: 'Buscar pistas',
    description:
      'Envases, olores, pupilas, signos de inyeccion, notas. Identificar toxidrome probable.',
  },
  {
    id: 'intox-no-vomito',
    title: 'No inducir vomito',
    description: 'Especialmente en causticos o hidrocarburos.',
  },
  {
    id: 'intox-antidotos',
    title: 'Antidotos si aplica',
    description:
      'Naloxona en sospecha de opioides. Flumazenilo solo segun protocolo y riesgo.',
  },
  {
    id: 'intox-descontaminacion',
    title: 'Descontaminacion',
    description:
      'Retirar ropa contaminada, ventilar escena. No inducir vomito en causticos.',
  },
  {
    id: 'intox-traslado',
    title: 'Traslado urgente',
    description: 'Monitorizacion continua y comunicacion de toxico sospechado.',
  },
];
