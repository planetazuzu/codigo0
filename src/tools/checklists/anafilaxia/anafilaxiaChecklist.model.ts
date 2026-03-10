export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
}

export const anafilaxiaChecklistSteps: ChecklistStep[] = [
  {
    id: 'anafilaxia-abcde',
    title: 'ABCDE y oxigeno',
    description: 'Asegurar via aerea, O2 alto flujo, monitorizacion y acceso venoso.',
  },
  {
    id: 'anafilaxia-signos',
    title: 'Confirmar gravedad',
    description:
      'Compromiso respiratorio, hipotension, alteracion mental o afectacion multiorganica.',
  },
  {
    id: 'anafilaxia-adrenalina',
    title: 'Adrenalina IM inmediata',
    description:
      '1:1000 IM en muslo. Adulto 0.5 mg; ninos 0.01 mg/kg. Repetir cada 5 min si precisa.',
  },
  {
    id: 'anafilaxia-repeticion',
    title: 'Reevaluacion 5 min',
    description:
      'Si persisten sintomas, repetir adrenalina IM. Preparar segunda dosis.',
  },
  {
    id: 'anafilaxia-fluidos',
    title: 'Fluidos y posicion',
    description:
      'Posicion supina con piernas elevadas si hipotension. Cristaloides si shock.',
  },
  {
    id: 'anafilaxia-adyuvantes',
    title: 'Tratamiento adyuvante',
    description:
      'Broncodilatador si broncoespasmo. Corticoide/antihistaminico segun protocolo.',
  },
  {
    id: 'anafilaxia-traslado',
    title: 'Traslado urgente',
    description:
      'Monitorizacion continua. Vigilar rebrote. Comunicar tiempos y dosis.',
  },
];
