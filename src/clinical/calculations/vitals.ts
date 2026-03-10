import type { Vitals } from '../patient/types';
import type { ClinicalResult, SeverityLevel } from './types';

type VitalsWithGcs = Vitals & { gcs?: number };

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

export const calculateMAP = (systolicBP?: number, diastolicBP?: number): ClinicalResult => {
  if (!isValidNumber(systolicBP) || !isValidNumber(diastolicBP)) {
    return buildResult('N/A', 'Insufficient data for MAP', 'amber');
  }

  const map = (2 * diastolicBP + systolicBP) / 3;

  if (map < 65) {
    return buildResult(map, 'MAP low (hypotension risk)', 'red');
  }

  if (map < 75) {
    return buildResult(map, 'MAP borderline', 'amber');
  }

  return buildResult(map, 'MAP adequate', 'green');
};

export const calculateShockIndex = (heartRate?: number, systolicBP?: number): ClinicalResult => {
  if (!isValidNumber(heartRate) || !isValidNumber(systolicBP) || systolicBP <= 0) {
    return buildResult('N/A', 'Insufficient data for Shock Index', 'amber');
  }

  const index = heartRate / systolicBP;

  if (index >= 1) {
    return buildResult(index, 'Shock Index high (possible shock)', 'red');
  }

  if (index >= 0.7) {
    return buildResult(index, 'Shock Index elevated', 'amber');
  }

  return buildResult(index, 'Shock Index normal', 'green');
};

export const calculateqSOFA = (vitals: VitalsWithGcs): ClinicalResult => {
  const { respiratoryRate, systolicBP, gcs } = vitals;

  if (!isValidNumber(respiratoryRate) || !isValidNumber(systolicBP) || !isValidNumber(gcs)) {
    return buildResult('N/A', 'Insufficient data for qSOFA', 'amber');
  }

  const score =
    (respiratoryRate >= 22 ? 1 : 0) +
    (systolicBP <= 100 ? 1 : 0) +
    (gcs < 15 ? 1 : 0);

  if (score >= 2) {
    return buildResult(score, 'qSOFA high risk', 'red');
  }

  if (score === 1) {
    return buildResult(score, 'qSOFA elevated risk', 'amber');
  }

  return buildResult(score, 'qSOFA low risk', 'green');
};

const scoreRespiratoryRate = (respiratoryRate: number): number => {
  if (respiratoryRate <= 8) return 3;
  if (respiratoryRate <= 11) return 1;
  if (respiratoryRate <= 20) return 0;
  if (respiratoryRate <= 24) return 2;
  return 3;
};

const scoreOxygenSaturation = (oxygenSaturation: number): number => {
  if (oxygenSaturation >= 96) return 0;
  if (oxygenSaturation >= 94) return 1;
  if (oxygenSaturation >= 92) return 2;
  return 3;
};

const scoreSystolicBP = (systolicBP: number): number => {
  if (systolicBP <= 90) return 3;
  if (systolicBP <= 100) return 2;
  if (systolicBP <= 110) return 1;
  if (systolicBP <= 219) return 0;
  return 3;
};

const scoreHeartRate = (heartRate: number): number => {
  if (heartRate <= 40) return 3;
  if (heartRate <= 50) return 1;
  if (heartRate <= 90) return 0;
  if (heartRate <= 110) return 1;
  if (heartRate <= 130) return 2;
  return 3;
};

const scoreTemperature = (temperatureC: number): number => {
  if (temperatureC <= 35) return 3;
  if (temperatureC <= 36) return 1;
  if (temperatureC <= 38) return 0;
  if (temperatureC <= 39) return 1;
  return 2;
};

const scoreConsciousness = (gcs: number): number => (gcs < 15 ? 3 : 0);

export const calculateNEWS2 = (vitals: VitalsWithGcs): ClinicalResult => {
  const { respiratoryRate, oxygenSaturation, systolicBP, heartRate, temperatureC, gcs } = vitals;

  if (
    !isValidNumber(respiratoryRate) ||
    !isValidNumber(oxygenSaturation) ||
    !isValidNumber(systolicBP) ||
    !isValidNumber(heartRate) ||
    !isValidNumber(temperatureC) ||
    !isValidNumber(gcs)
  ) {
    return buildResult('N/A', 'Insufficient data for NEWS2', 'amber');
  }

  // Basic NEWS2 scoring (scale 1 only). Oxygen therapy not accounted for.
  const score =
    scoreRespiratoryRate(respiratoryRate) +
    scoreOxygenSaturation(oxygenSaturation) +
    scoreSystolicBP(systolicBP) +
    scoreHeartRate(heartRate) +
    scoreTemperature(temperatureC) +
    scoreConsciousness(gcs);

  if (score >= 7) {
    return buildResult(score, 'NEWS2 high risk', 'red');
  }

  if (score >= 5) {
    return buildResult(score, 'NEWS2 medium risk', 'amber');
  }

  return buildResult(score, 'NEWS2 low risk', 'green');
};
