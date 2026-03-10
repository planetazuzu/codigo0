import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ClinicalFlags, Patient, Sex, Vitals } from './types';

const STORAGE_KEY = 'patient_context_v1';
const TTL_MS = 24 * 60 * 60 * 1000;

interface PatientState {
  patient: Patient;
  vitals: Vitals;
  clinicalFlags: ClinicalFlags;
}

interface StoredPatientContext {
  data: PatientState;
  expiresAt: number;
}

interface PatientContextValue {
  state: PatientState;
  setPatientBasics: (basics: { age?: number; weight?: number; sex?: Sex }) => void;
  updateVitals: (updates: Partial<Vitals>) => void;
  setClinicalFlags: (flags: ClinicalFlags) => void;
  resetPatient: () => void;
}

// Estado inicial explícito con null para evitar accesos inseguros
const defaultState: PatientState = {
  patient: {
    age: undefined,
    weight: undefined,
    sex: undefined,
  },
  vitals: {
    heartRate: undefined,
    respiratoryRate: undefined,
    oxygenSaturation: undefined,
    systolicBP: undefined,
    diastolicBP: undefined,
    temperatureC: undefined,
    glucoseMgDl: undefined,
    gcs: undefined,
  },
  clinicalFlags: {},
};

const PatientContext = createContext<PatientContextValue | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

const loadFromStorage = (): StoredPatientContext | null => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPatientContext;
  } catch {
    return null;
  }
};

const saveToStorage = (state: PatientState) => {
  if (!isBrowser) return;
  try {
    const payload: StoredPatientContext = {
      data: state,
      expiresAt: Date.now() + TTL_MS,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Silencioso para evitar romper la UI si falla el storage
  }
};

const clearStorage = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silencioso
  }
};

export const PatientContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<PatientState>(defaultState);

  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored) return;

    if (stored.expiresAt <= Date.now()) {
      clearStorage();
      setState(defaultState);
      return;
    }

    setState(stored.data || defaultState);
  }, []);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const value = useMemo<PatientContextValue>(() => ({
    state,
    setPatientBasics: (basics) => {
      setState((prev) => ({
        ...prev,
        patient: {
          ...prev.patient,
          ...basics,
        },
      }));
    },
    updateVitals: (updates) => {
      setState((prev) => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          ...updates,
        },
      }));
    },
    setClinicalFlags: (flags) => {
      setState((prev) => ({
        ...prev,
        clinicalFlags: { ...flags },
      }));
    },
    resetPatient: () => {
      setState(defaultState);
      clearStorage();
    },
  }), [state]);

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within PatientContextProvider');
  }
  return context;
};
