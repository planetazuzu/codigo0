import type { ClinicalResult, SeverityLevel } from './types';

const isValidNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const buildResult = (
  value: number | string,
  interpretation: string,
  severity: SeverityLevel
): ClinicalResult => ({
  value,
  interpretation,
  severity,
});

export interface PerfusionDoseRange {
  min: number;
  max: number;
}

export interface PerfusionCalculationInput {
  weightKg?: number;
  doseMcgKgMin?: number;
  concentrationMcgMl?: number;
  doseRange?: PerfusionDoseRange;
}

export const calculatePerfusionMlPerHour = (
  input: PerfusionCalculationInput
): ClinicalResult => {
  const { weightKg, doseMcgKgMin, concentrationMcgMl, doseRange } = input;

  if (
    !isValidNumber(weightKg) ||
    !isValidNumber(doseMcgKgMin) ||
    !isValidNumber(concentrationMcgMl) ||
    weightKg <= 0 ||
    doseMcgKgMin <= 0 ||
    concentrationMcgMl <= 0
  ) {
    return buildResult('N/A', 'Datos insuficientes para calcular ml/h', 'amber');
  }

  const mlPerHour = (doseMcgKgMin * weightKg * 60) / concentrationMcgMl;

  if (doseRange) {
    if (doseMcgKgMin > doseRange.max) {
      return buildResult(mlPerHour, 'Dosis por encima del rango habitual', 'red');
    }
    if (doseMcgKgMin < doseRange.min) {
      return buildResult(mlPerHour, 'Dosis por debajo del rango habitual', 'amber');
    }
  }

  return buildResult(mlPerHour, 'Dosis dentro de rango habitual', 'green');
};

export const calculateDropsPerMinute = (
  mlPerHour?: number,
  dropsPerMl: number = 20
): ClinicalResult => {
  if (!isValidNumber(mlPerHour) || !isValidNumber(dropsPerMl) || mlPerHour <= 0 || dropsPerMl <= 0) {
    return buildResult('N/A', 'Datos insuficientes para gotas/min', 'amber');
  }

  const dropsPerMinute = (mlPerHour * dropsPerMl) / 60;
  return buildResult(dropsPerMinute, 'Goteo estimado', 'green');
};
