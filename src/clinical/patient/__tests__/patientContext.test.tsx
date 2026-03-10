import { useEffect } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { PatientContextProvider, usePatient } from '../index';

const STORAGE_KEY = 'patient_context_v1';

const TestConsumer = ({ onReady }: { onReady?: (value: ReturnType<typeof usePatient>) => void }) => {
  const context = usePatient();

  useEffect(() => {
    onReady?.(context);
  }, [context, onReady]);

  return (
    <div>
      <div data-testid="age">{context.state.patient.age ?? 'n/a'}</div>
      <div data-testid="heartRate">{context.state.vitals.heartRate ?? 'n/a'}</div>
    </div>
  );
};

describe('PatientContext persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists patient state to localStorage and reloads it', async () => {
    let api: ReturnType<typeof usePatient> | undefined;

    const { unmount } = render(
      <PatientContextProvider>
        <TestConsumer onReady={(value) => { api = value; }} />
      </PatientContextProvider>
    );

    expect(screen.getByTestId('age').textContent).toBe('n/a');

    act(() => {
      api?.setPatientBasics({ age: 42, weight: 80, sex: 'male' });
      api?.updateVitals({ heartRate: 90 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('age').textContent).toBe('42');
      expect(screen.getByTestId('heartRate').textContent).toBe('90');
    });

    unmount();

    render(
      <PatientContextProvider>
        <TestConsumer />
      </PatientContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('age').textContent).toBe('42');
      expect(screen.getByTestId('heartRate').textContent).toBe('90');
    });
  });

  it('auto-resets state when persisted data is expired', async () => {
    const expiredPayload = {
      data: {
        patient: { age: 55 },
        vitals: { heartRate: 100 },
        clinicalFlags: { hypotension: true },
      },
      expiresAt: Date.now() - 1000,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredPayload));

    render(
      <PatientContextProvider>
        <TestConsumer />
      </PatientContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('age').textContent).toBe('n/a');
      expect(screen.getByTestId('heartRate').textContent).toBe('n/a');
    });
  });
});
