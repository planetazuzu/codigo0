import { describe, it, expect } from 'vitest';
import { featureFlags } from './featureFlags';

describe('featureFlags', () => {
  it('exporta flags esperados', () => {
    expect(featureFlags).toHaveProperty('advancedTools');
    expect(featureFlags).toHaveProperty('vitalsDashboard');
    expect(featureFlags).toHaveProperty('smartPerfusions');
    expect(featureFlags).toHaveProperty('interactiveChecklists');
    expect(featureFlags).toHaveProperty('pathways');
  });

  it('todos los flags son booleanos', () => {
    expect(typeof featureFlags.advancedTools).toBe('boolean');
    expect(typeof featureFlags.vitalsDashboard).toBe('boolean');
    expect(typeof featureFlags.smartPerfusions).toBe('boolean');
    expect(typeof featureFlags.interactiveChecklists).toBe('boolean');
    expect(typeof featureFlags.pathways).toBe('boolean');
  });
});
