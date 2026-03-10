import type { Patient, Vitals } from '../patient/types';
import { rules } from './rules';
import type { RuleResult } from './types';

interface RuleContext {
  patient: Patient;
  vitals: Vitals;
}

const priorityOrder: Record<RuleResult['priority'], number> = {
  CRITICAL: 3,
  HIGH: 2,
  MEDIUM: 1,
};

export const evaluateRules = (context: RuleContext): RuleResult[] => {
  const results = rules
    .map((rule) => rule(context))
    .filter((result): result is RuleResult => Boolean(result));

  return results.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
};
