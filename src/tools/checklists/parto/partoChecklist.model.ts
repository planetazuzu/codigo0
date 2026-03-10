export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
}

export const partoChecklistSteps: ChecklistStep[] = [
  {
    id: 'parto-evaluacion',
    title: 'Evaluacion rapida',
    description:
      'Confirmar parto inminente: deseo de pujar, perine abombado, coronamiento, contracciones 1-2 min.',
  },
  {
    id: 'parto-no-inminente',
    title: 'Si NO es inminente',
    description:
      'Posicion lateral izquierda, oxigeno si precisa y traslado urgente sin demoras.',
  },
  {
    id: 'parto-preparacion',
    title: 'Preparacion y EPI',
    description:
      'Guantes, proteccion facial, compresas, pinzas, tijeras, manta tibia. Aviso a coordinacion.',
  },
  {
    id: 'parto-asistencia',
    title: 'Asistencia al parto normal',
    description:
      'No frenar ni tirar. Apoyar perine. Revisar cordon en cuello. Facilitar salida de hombros.',
  },
  {
    id: 'parto-cordon',
    title: 'Cordon umbilical',
    description:
      'Si circular, pasar sobre la cabeza. Si apretado, clamp y cortar antes de salida completa.',
  },
  {
    id: 'parto-rn',
    title: 'Atencion al recien nacido',
    description:
      'Secar, estimular, piel con piel y calor. Valorar respiracion y FC. Pinzar cordon 1-2 min.',
  },
  {
    id: 'parto-reanimacion',
    title: 'Si no respira / FC < 100',
    description:
      'Ventilacion con BVM neonatal 40-60/min. Si FC < 60 tras 30s, compresiones 3:1.',
  },
  {
    id: 'parto-placenta',
    title: 'Placenta y traslado',
    description:
      'No tirar del cordon. Recoger placenta para inspeccion. Traslado urgente tras estabilizacion.',
  },
  {
    id: 'parto-pph',
    title: 'Hemorragia postparto',
    description:
      'Masaje uterino bimanual si sangrado. Considerar oxitocina si protocolo. Traslado inmediato.',
  },
];
