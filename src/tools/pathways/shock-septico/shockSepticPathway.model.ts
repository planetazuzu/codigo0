export interface PathwayStep {
  id: string;
  title: string;
  description: string;
}

export interface PathwaySection {
  id: string;
  title: string;
  description?: string;
  steps: PathwayStep[];
}

export const shockSepticPathwaySections: PathwaySection[] = [
  {
    id: 'reconocimiento',
    title: 'Reconocimiento',
    description: 'Identifica sepsis o shock séptico de forma precoz.',
    steps: [
      {
        id: 'recon-infeccion',
        title: 'Sospecha de infección',
        description: 'Foco probable + fiebre/hipotermia, taquicardia o taquipnea.',
      },
      {
        id: 'recon-disfuncion',
        title: 'Disfunción orgánica',
        description: 'Alteración del estado mental, FR elevada, hipotensión o hipoxemia.',
      },
      {
        id: 'recon-qsofa',
        title: 'Cribado rápido',
        description: 'qSOFA ≥ 2 o signos de hipoperfusión.',
      },
    ],
  },
  {
    id: 'acciones',
    title: 'Acciones inmediatas (0-15 min)',
    description: 'Estabiliza y prepara tratamiento.',
    steps: [
      {
        id: 'acci-abcde',
        title: 'ABCDE + monitorización',
        description: 'Oxígeno, monitor, vía aérea y control de constantes.',
      },
      {
        id: 'acci-iv',
        title: 'Vías y analíticas',
        description: 'Dos vías periféricas + extracción para lactato si procede.',
      },
      {
        id: 'acci-cultivos',
        title: 'Cultivos si es posible',
        description: 'Antes de antibiótico cuando no retrase el inicio.',
      },
      {
        id: 'acci-fluidos',
        title: 'Iniciar fluidos',
        description: 'Cristaloides 30 ml/kg si hipotensión o lactato ≥ 4.',
      },
    ],
  },
  {
    id: 'tratamiento',
    title: 'Tratamiento (15-60 min)',
    description: 'Control del foco y soporte hemodinámico.',
    steps: [
      {
        id: 'trat-antibiotico',
        title: 'Antibiótico temprano',
        description: 'Administrar < 1 hora desde reconocimiento.',
      },
      {
        id: 'trat-vasopresor',
        title: 'Vasopresor si MAP < 65',
        description: 'Tras fluidos, considerar noradrenalina.',
      },
      {
        id: 'trat-reevaluacion',
        title: 'Reevaluación clínica',
        description: 'TA, FC, relleno capilar, estado mental, diuresis.',
      },
    ],
  },
  {
    id: 'traslado',
    title: 'Reevaluación y traslado',
    description: 'Documenta, comunica y prepara el traslado.',
    steps: [
      {
        id: 'tras-documentar',
        title: 'Documentar tiempos',
        description: 'Inicio síntomas, antibiótico y volumen administrado.',
      },
      {
        id: 'tras-comunicar',
        title: 'Comunicación hospitalaria',
        description: 'Preaviso con situación, tiempos y respuesta clínica.',
      },
      {
        id: 'tras-traslado',
        title: 'Traslado monitorizado',
        description: 'Reevaluar cada 5-10 min durante el transporte.',
      },
    ],
  },
];
