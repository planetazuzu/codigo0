import { usePatient } from './PatientContext';
import type { Patient, Vitals, ClinicalFlags } from './types';

/**
 * Hook seguro para acceder al contexto del paciente con validaciones integradas
 * Proporciona valores por defecto seguros y helpers de validación
 */
export const usePatientSafe = () => {
  const context = usePatient();
  const { state } = context;

  /**
   * Verifica si el paciente tiene datos básicos disponibles
   */
  const isPatientReady = (): boolean => {
    return state.patient !== null && state.patient !== undefined;
  };

  /**
   * Verifica si los signos vitales tienen datos disponibles
   */
  const isVitalsReady = (): boolean => {
    return state.vitals !== null && state.vitals !== undefined;
  };

  /**
   * Obtiene el paciente con valores por defecto seguros
   */
  const getPatient = (): Patient => {
    return state.patient ?? {
      age: undefined,
      weight: undefined,
      sex: undefined,
    };
  };

  /**
   * Obtiene los signos vitales con valores por defecto seguros
   */
  const getVitals = (): Vitals => {
    return state.vitals ?? {
      heartRate: undefined,
      respiratoryRate: undefined,
      oxygenSaturation: undefined,
      systolicBP: undefined,
      diastolicBP: undefined,
      temperatureC: undefined,
      glucoseMgDl: undefined,
      gcs: undefined,
    };
  };

  /**
   * Obtiene las flags clínicas con valor por defecto seguro
   */
  const getClinicalFlags = (): ClinicalFlags => {
    return state.clinicalFlags ?? {};
  };

  /**
   * Verifica si una propiedad específica del paciente está disponible
   */
  const hasPatientProperty = <K extends keyof Patient>(key: K): boolean => {
    const patient = getPatient();
    return patient[key] !== undefined && patient[key] !== null;
  };

  /**
   * Verifica si una propiedad específica de signos vitales está disponible
   */
  const hasVitalProperty = <K extends keyof Vitals>(key: K): boolean => {
    const vitals = getVitals();
    return vitals[key] !== undefined && vitals[key] !== null;
  };

  return {
    // Estado completo (acceso directo para casos avanzados)
    state,
    
    // Getters seguros
    patient: getPatient(),
    vitals: getVitals(),
    clinicalFlags: getClinicalFlags(),
    
    // Helpers de validación
    isPatientReady: isPatientReady(),
    isVitalsReady: isVitalsReady(),
    hasPatientProperty,
    hasVitalProperty,
    
    // Métodos del contexto original
    setPatientBasics: context.setPatientBasics,
    updateVitals: context.updateVitals,
    setClinicalFlags: context.setClinicalFlags,
    resetPatient: context.resetPatient,
  };
};
