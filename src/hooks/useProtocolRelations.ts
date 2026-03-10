import { useState, useEffect } from 'react';
import { getProtocolRelationsSafe } from '@/services/content-relations';
import type { AsyncDataState } from '@/types/data-states';
import type { ProtocolRelations } from '@/types/data-states';

/**
 * Hook seguro para obtener relaciones de un protocolo
 * 
 * Maneja estados de carga, error y not_found explícitamente
 * usando Discriminated Unions para type safety.
 * 
 * @param protocolId - ID del protocolo
 * @returns Estado con relaciones del protocolo
 */
export function useProtocolRelations(protocolId: string | undefined): AsyncDataState<ProtocolRelations> {
  const [state, setState] = useState<AsyncDataState<ProtocolRelations>>({ 
    status: 'loading' 
  });

  useEffect(() => {
    // Validar que el ID existe
    if (!protocolId || typeof protocolId !== 'string' || protocolId.trim().length === 0) {
      setState({ 
        status: 'error', 
        error: new Error('ID de protocolo requerido') 
      });
      return;
    }

    // Obtener relaciones con validación
    const result = getProtocolRelationsSafe(protocolId);

    if (result.success && result.data) {
      setState({ 
        status: 'success', 
        data: result.data as ProtocolRelations 
      });
    } else {
      setState({ 
        status: 'error', 
        error: result.error || new Error(`No se pudieron obtener relaciones para protocolo ${protocolId}`) 
      });
    }
  }, [protocolId]);

  return state;
}
