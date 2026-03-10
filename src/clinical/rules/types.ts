export type RulePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface RuleAction {
  label: string;
  route?: string;
}

export interface RuleResult {
  id: string;
  priority: RulePriority;
  message: string;
  actions: RuleAction[];
}
