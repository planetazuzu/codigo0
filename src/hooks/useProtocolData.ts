import { useState, useEffect } from 'react';
import { getProcedureByIdSafe } from '@/data/procedures/utils';
import type { Procedure } from '@/data/procedures';
import type { AsyncDataState } from '@/types/data-states';

/**
 * Hook seguro para obtener un protocolo por ID
 * 
 * Maneja estados de carga, error y not_found explícitamente
 * usando Discriminated Unions para type safety.
 * 
 * @param id - ID del protocolo
 * @returns Estado con el protocolo
 */
export function useProtocolData(id: string | undefined): AsyncDataState<Procedure> {
  const [state, setState] = useState<AsyncDataState<Procedure>>({ 
    status: 'loading' 
  });

  useEffect(() => {
    // Validar que el ID existe
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      setState({ 
        status: 'error', 
        error: new Error('ID de protocolo requerido') 
      });
      return;
    }

    // Obtener protocolo con validación
    const result = getProcedureByIdSafe(id);

    if (result.success && result.data) {
      setState({ 
        status: 'success', 
        data: result.data 
      });
    } else {
      // Distinguir entre "no encontrado" y "error"
      const errorMessage = result.error?.message || '';
      if (errorMessage.includes('no encontrado')) {
        setState({ status: 'not_found' });
      } else {
        setState({ 
          status: 'error', 
          error: result.error || new Error(`Error al obtener protocolo ${id}`) 
        });
      }
    }
  }, [id]);

  return state;
}
