import type { Patient, Vitals } from '../patient/types';
import { calculateMAP, calculateShockIndex, calculateqSOFA } from '../calculations';
import type { RuleResult } from './types';

interface RuleContext {
  patient: Patient;
  vitals: Vitals;
}

type RuleEvaluator = (context: RuleContext) => RuleResult | null;

export const rules: RuleEvaluator[] = [
  (context) => {
    const gcs = context.vitals.gcs;
    if (typeof gcs !== 'number') return null;
    if (gcs <= 8) {
      return {
        id: 'airway_critical',
        priority: 'CRITICAL',
        message: 'Glasgow ≤ 8. Considerar vía aérea avanzada.',
        actions: [{ label: 'Guía vía aérea (próximamente)' }],
      };
    }
    return null;
  },
  (context) => {
    const qsofa = calculateqSOFA(context.vitals);
    if (typeof qsofa.value !== 'number') return null;
    if (qsofa.value >= 2) {
      return {
        id: 'sepsis_alert',
        priority: 'HIGH',
        message: 'qSOFA ≥ 2. Sospecha de sepsis.',
        actions: [{ label: 'Checklist Sepsis', route: '/checklists/sepsis' }],
      };
    }
    return null;
  },
  (context) => {
    const map = calculateMAP(context.vitals.systolicBP, context.vitals.diastolicBP);
    const shockIndex = calculateShockIndex(context.vitals.heartRate, context.vitals.systolicBP);
    if (typeof map.value !== 'number' || typeof shockIndex.value !== 'number') return null;
    if (shockIndex.value > 1 && map.value < 65) {
      return {
        id: 'shock_alert',
        priority: 'CRITICAL',
        message: 'Shock Index > 1 y MAP < 65. Shock probable.',
        actions: [{ label: 'Perfusiones', route: '/herramientas' }],
      };
    }
    return null;
  },
];
