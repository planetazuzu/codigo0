import { describe, expect, it } from 'vitest';
import {
  calculateMAP,
  calculateNEWS2,
  calculateShockIndex,
  calculateqSOFA,
} from '../vitals';

describe('clinical calculations', () => {
  it('calculates MAP correctly', () => {
    const result = calculateMAP(120, 80);
    expect(typeof result.value).toBe('number');
    expect(result.value).toBeCloseTo(93.33, 2);
    expect(result.severity).toBe('green');
  });

  it('flags low MAP as red', () => {
    const result = calculateMAP(80, 50);
    expect(result.severity).toBe('red');
  });

  it('calculates Shock Index correctly', () => {
    const result = calculateShockIndex(70, 120);
    expect(typeof result.value).toBe('number');
    expect(result.value).toBeCloseTo(0.58, 2);
    expect(result.severity).toBe('green');
  });

  it('flags high Shock Index as red', () => {
    const result = calculateShockIndex(110, 100);
    expect(result.severity).toBe('red');
  });

  it('scores qSOFA correctly for low risk', () => {
    const result = calculateqSOFA({ respiratoryRate: 16, systolicBP: 120, gcs: 15 });
    expect(result.value).toBe(0);
    expect(result.severity).toBe('green');
  });

  it('scores qSOFA correctly for high risk', () => {
    const result = calculateqSOFA({ respiratoryRate: 24, systolicBP: 90, gcs: 14 });
    expect(result.value).toBe(3);
    expect(result.severity).toBe('red');
  });

  it('scores NEWS2 as low risk for normal vitals', () => {
    const result = calculateNEWS2({
      respiratoryRate: 16,
      oxygenSaturation: 98,
      systolicBP: 120,
      heartRate: 80,
      temperatureC: 36.8,
      gcs: 15,
    });

    expect(result.value).toBe(0);
    expect(result.severity).toBe('green');
  });

  it('scores NEWS2 as high risk for critical vitals', () => {
    const result = calculateNEWS2({
      respiratoryRate: 30,
      oxygenSaturation: 90,
      systolicBP: 85,
      heartRate: 140,
      temperatureC: 39.5,
      gcs: 14,
    });

    expect(typeof result.value).toBe('number');
    expect(result.severity).toBe('red');
    expect((result.value as number) >= 7).toBe(true);
  });
});
