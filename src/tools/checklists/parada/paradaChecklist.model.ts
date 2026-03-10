export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
}

export const paradaChecklistSteps: ChecklistStep[] = [
  {
    id: 'seguridad',
    title: 'Seguridad de la escena',
    description: 'Confirmar entorno seguro para el equipo.',
  },
  {
    id: 'respuesta',
    title: 'Comprobar respuesta y respiración',
    description: 'Valorar consciencia y respiración en 10 segundos.',
  },
  {
    id: 'activar',
    title: 'Activar ayuda',
    description: 'Solicitar soporte y pedir DESA.',
  },
  {
    id: 'rcp',
    title: 'Iniciar RCP de alta calidad',
    description: 'Compresiones 100-120/min, profundidad adecuada.',
  },
  {
    id: 'desa',
    title: 'Analizar ritmo y desfibrilar si aplica',
    description: 'Seguir instrucciones del DESA/monitor.',
  },
  {
    id: 'via_aerea',
    title: 'Asegurar vía aérea',
    description: 'Considerar dispositivo supraglótico o intubación.',
  },
  {
    id: 'farmacos',
    title: 'Administrar fármacos según protocolo',
    description: 'Adrenalina y otros según ritmo y tiempos.',
  },
  {
    id: 'reversibles',
    title: 'Buscar causas reversibles',
    description: 'Hipoxia, hipovolemia, trombosis, etc.',
  },
  {
    id: 'traslado',
    title: 'Preparar traslado y documentación',
    description: 'Registrar tiempos y eventos clave.',
  },
];
