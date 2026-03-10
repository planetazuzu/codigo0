export type SeverityLevel = 'green' | 'amber' | 'red';

export interface ClinicalResult {
  value: number | string;
  interpretation: string;
  severity: SeverityLevel;
}
