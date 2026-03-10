/**
 * SERVICIO DE RELACIONES DE CONTENIDO
 * 
 * Proporciona funciones para obtener relaciones bidireccionales
 * entre protocolos, guías y manual usando ContentAdapter
 */

import { getProtocol, getGuide, getAllProtocols, getAllGuides } from './content-adapter';
import { getMappingByProtocolId, getMappingByGuiaId } from '../data/protocol-guide-manual-mapping';
import type { Procedure } from '../data/procedures';
import type { Guide } from './content-adapter';

/**
 * Obtiene la guía relacionada con un protocolo
 */
export function getGuideForProtocol(protocolId: string): Guide | null {
  const mapping = getMappingByProtocolId(protocolId);
  if (!mapping || !mapping.tieneGuia || !mapping.guiaId) {
    return null;
  }
  
  return getGuide(mapping.guiaId);
}

/**
 * Obtiene el protocolo relacionado con una guía
 */
export function getProtocolForGuide(guideId: string): Procedure | null {
  const mapping = getMappingByGuiaId(guideId);
  if (!mapping || !('protocoloId' in mapping) || !mapping.protocoloId) {
    return null;
  }
  
  return getProtocol(mapping.protocoloId);
}

/**
 * Obtiene todas las relaciones para un protocolo
 * 
 * ⚠️ ADVERTENCIA: Esta función puede retornar propiedades null.
 * Usar getProtocolRelationsSafe() o useProtocolRelations() hook para validación explícita.
 * 
 * @param protocolId - ID del protocolo
 * @returns Objeto con relaciones (pueden ser null)
 */
export function getProtocolRelations(protocolId: string): {
  protocol: Procedure | null;
  guide: Guide | null;
  manual: {
    bloque?: string;
    ruta?: string;
    titulo?: string;
  } | null;
  mapping: ReturnType<typeof getMappingByProtocolId>;
} {
  if (!protocolId || typeof protocolId !== 'string' || protocolId.trim().length === 0) {
    return {
      protocol: null,
      guide: null,
      manual: null,
      mapping: undefined,
    };
  }
  
  const mapping = getMappingByProtocolId(protocolId);
  const protocol = getProtocol(protocolId);
  
  return {
    protocol,
    guide: mapping?.tieneGuia && mapping.guiaId ? getGuide(mapping.guiaId) : null,
    manual: mapping?.tieneManual ? {
      bloque: mapping.manualBloque,
      ruta: mapping.manualRuta,
      titulo: mapping.manualTitulo,
    } : null,
    mapping,
  };
}

/**
 * Obtiene todas las relaciones para un protocolo con validación explícita
 * 
 * @param protocolId - ID del protocolo
 * @returns Resultado seguro con validación explícita
 */
export function getProtocolRelationsSafe(protocolId: string): {
  success: boolean;
  data?: ReturnType<typeof getProtocolRelations>;
  error?: Error;
} {
  if (!protocolId || typeof protocolId !== 'string' || protocolId.trim().length === 0) {
    return {
      success: false,
      error: new Error('ID de protocolo inválido o vacío'),
    };
  }
  
  try {
    const relations = getProtocolRelations(protocolId);
    return {
      success: true,
      data: relations,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Error al obtener relaciones del protocolo'),
    };
  }
}

/**
 * Obtiene todas las relaciones para una guía
 */
export function getGuideRelations(guideId: string) {
  const mapping = getMappingByGuiaId(guideId);
  const guide = getGuide(guideId);
  
  return {
    guide,
    protocol: mapping && 'protocoloId' in mapping && mapping.protocoloId 
      ? getProtocol(mapping.protocoloId) 
      : null,
    manual: mapping?.tieneManual ? {
      bloque: mapping.manualBloque,
      ruta: mapping.manualRuta,
      titulo: mapping.manualTitulo,
    } : null,
    mapping,
  };
}


