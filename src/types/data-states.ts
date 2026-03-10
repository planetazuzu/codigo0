/**
 * TIPOS DISCRIMINATED UNION PARA ESTADOS DE DATOS
 * 
 * Proporciona tipos seguros para estados de carga, éxito y error
 * que fuerzan el manejo explícito de todos los casos posibles.
 */

/**
 * Estado genérico para datos que pueden no existir
 */
export type DataState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'not_found' };

/**
 * Estado para datos asíncronos (sin idle)
 */
export type AsyncDataState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'not_found' };

/**
 * Resultado de operación con validación explícita
 */
export type SafeResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

import type { Procedure } from '@/data/procedures';
import type { Guide } from '@/services/content-adapter';
import type { ProtocolGuideManualMapping } from '@/data/protocol-guide-manual-mapping';

/**
 * Estado para relaciones de protocolos (pueden tener propiedades null)
 */
export interface ProtocolRelations {
  protocol: Procedure | null;
  guide: Guide | null;
  manual: {
    bloque?: string;
    ruta?: string;
    titulo?: string;
  } | null;
  mapping: ProtocolGuideManualMapping | undefined;
}

export type ProtocolRelationsState = AsyncDataState<ProtocolRelations>;

/**
 * Helper type guard para verificar si un estado es success
 */
export function isSuccessState<T>(
  state: DataState<T> | AsyncDataState<T>
): state is { status: 'success'; data: T } {
  return state.status === 'success';
}

/**
 * Helper type guard para verificar si un estado es error
 */
export function isErrorState<T>(
  state: DataState<T> | AsyncDataState<T>
): state is { status: 'error'; error: Error } {
  return state.status === 'error';
}

/**
 * Helper type guard para verificar si un estado es not_found
 */
export function isNotFoundState<T>(
  state: DataState<T> | AsyncDataState<T>
): state is { status: 'not_found' } {
  return state.status === 'not_found';
}
