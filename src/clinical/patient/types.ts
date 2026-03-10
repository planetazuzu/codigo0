export type Sex = 'male' | 'female' | 'other' | 'unknown';

export interface Patient {
  age?: number;
  weight?: number;
  sex?: Sex;
}

export interface Vitals {
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  systolicBP?: number;
  diastolicBP?: number;
  temperatureC?: number;
  glucoseMgDl?: number;
  gcs?: number;
}

export type ClinicalFlags = Record<string, boolean>;
