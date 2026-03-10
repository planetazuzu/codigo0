import type { Drug } from '../types.js';

export const oxigenoterapiaDrugs: Drug[] = [
  {
    id: 'oxigeno',
    genericName: 'Oxígeno (O₂)',
    tradeName: 'Oxígeno medicinal',
    category: 'oxigenoterapia',
    presentation: 'Gas medicinal. Balas de 2L, 5L, 10L, 15L. Concentración variable según dispositivo.',
    adultDose: 'Mascarilla con reservorio: 10-15 L/min (FiO₂ ~85%). Mascarilla simple: 5-10 L/min (FiO₂ ~40-60%). Gafas nasales: 1-6 L/min (FiO₂ 24-44%).',
    pediatricDose: 'Ajustar por respuesta. Gafas nasales: 1-4 L/min. Mascarilla simple: 5-8 L/min. En lactantes, evitar flujos >4L/min por riesgo de retinopatía.',
    routes: ['Nebulizado'], // Mapear 'Inhalatoria' a 'Nebulizado' para compatibilidad con tipo
    indications: [
      'Hipoxia (SpO₂ <94%)',
      'Parada cardiorrespiratoria',
      'Ictus',
      'Síndrome Coronario Agudo',
      'Trauma grave',
    ],
    contraindications: [
      'En EPOC conocida con riesgo de hipercapnia: usar Venturi 28% y titular a SpO₂ 88-92%',
    ],
    notes: [
      'NO es un fármaco inocuo',
      'Humedecer si uso prolongado >2h',
      'En EPOC conocida: usar Venturi 28% y titular a SpO₂ 88-92%',
    ],
    criticalPoints: [
      'Terapia, no placebo. Usarlo con indicación y precaución en EPOC',
      'En EPOC conocida con riesgo de hipercapnia, usar Venturi 28% y titular a SpO₂ 88-92%',
    ],
    source: 'BLOQUE_06_1_VADEMECUM_OPERATIVO.md'
  },
];
