export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
}

export const convulsionesChecklistSteps: ChecklistStep[] = [
  {
    id: 'conv-seguridad',
    title: 'Seguridad y proteccion',
    description: 'Retirar objetos peligrosos, proteger cabeza, no sujetar al paciente.',
  },
  {
    id: 'conv-tiempo',
    title: 'Cronometrar',
    description: 'Registrar inicio. Si > 5 min considerar tratamiento segun protocolo.',
  },
  {
    id: 'conv-abcde',
    title: 'ABCDE y glucemia',
    description: 'Valorar via aerea, respiracion, perfusion. Glucemia capilar.',
  },
  {
    id: 'conv-oxigeno',
    title: 'Oxigeno y posicion',
    description: 'O2 si precisa. Posicion lateral cuando ceda la crisis.',
  },
  {
    id: 'conv-farmaco',
    title: 'Tratamiento anticonvulsivante',
    description: 'Midazolam IN/IM/IV segun protocolo si crisis prolongada.',
  },
  {
    id: 'conv-traslado',
    title: 'Traslado urgente',
    description: 'Monitorizacion, valorar causa secundaria y comunicar tiempos.',
  },
];
