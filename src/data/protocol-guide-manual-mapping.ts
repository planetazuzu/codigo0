/**
 * Fase B1: Mapeo Formal Protocolo ⇄ Guías ⇄ Manual
 * 
 * Este archivo contiene la tabla de correspondencia oficial que conecta:
 * - Protocolos Operativos (Nivel 1: "¿Qué hago ahora?")
 * - Guías de Refuerzo (Nivel 2: "¿Por qué se hace así?")
 * - Manual Completo (Nivel 3: "Quiero todo el contexto")
 * 
 * IMPORTANTE: Este es un archivo de datos estático, no runtime.
 * Se usa para generar enlaces y navegación entre los 3 niveles.
 */

export interface ProtocolGuideManualMapping {
  // Protocolo Operativo
  protocoloId: string; // ID del protocolo en procedures.ts
  protocoloRuta?: string; // Ruta de la app (ej: "/rcp")
  protocoloTitulo: string; // Título del protocolo
  
  // Guía de Refuerzo
  guiaId?: string; // ID de la guía en guides-index.ts
  guiaRuta?: string; // Ruta de la guía (ej: "/guias/rcp-adulto-svb")
  guiaTitulo?: string; // Título de la guía
  tieneGuia: boolean; // Si existe guía formativa
  
  // Manual Completo
  manualBloque?: string; // Bloque del manual (ej: "BLOQUE_04_1")
  manualRuta?: string; // Ruta URL del manual
  manualTitulo?: string; // Título del capítulo del manual
  tieneManual: boolean; // Si existe manual completo
}

/**
 * Tabla de correspondencia oficial
 * 
 * Esta es la columna vertebral de toda la integración formativa.
 * Cada entrada conecta los 3 niveles de contenido.
 */
export const protocolGuideManualMapping: ProtocolGuideManualMapping[] = [
  // ===== RCP =====
  {
    protocoloId: 'rcp-adulto-svb',
    protocoloRuta: '/rcp',
    protocoloTitulo: 'RCP Adulto SVB',
    guiaId: 'rcp-adulto-svb',
    guiaRuta: '/guias/rcp-adulto-svb',
    guiaTitulo: 'RCP Adulto SVB',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_1',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.3',
    manualTitulo: 'RCP Adultos',
    tieneManual: true,
  },
  {
    protocoloId: 'rcp-adulto-sva',
    protocoloRuta: '/rcp',
    protocoloTitulo: 'RCP Adulto SVA',
    // No tiene guía formativa específica (comparte manual con SVB)
    tieneGuia: false,
    manualBloque: 'BLOQUE_04_1',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.3',
    manualTitulo: 'RCP Adultos',
    tieneManual: true,
  },
  {
    protocoloId: 'rcp-pediatrico',
    protocoloRuta: '/rcp',
    protocoloTitulo: 'RCP Pediátrico',
    guiaId: 'rcp-pediatrica', // Verificar ID en guides-index.ts
    guiaRuta: '/guias/rcp-pediatrica',
    guiaTitulo: 'RCP Pediátrica',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_2',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.4',
    manualTitulo: 'RCP Pediatría',
    tieneManual: true,
  },
  
  // ===== OVACE =====
  {
    protocoloId: 'obstruccion-via-aerea',
    protocoloRuta: '/via-aerea',
    protocoloTitulo: 'OVACE',
    guiaId: 'ovace-adulto', // Verificar ID en guides-index.ts
    guiaRuta: '/guias/ovace-adulto',
    guiaTitulo: 'OVACE Adulto',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_6',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.8',
    manualTitulo: 'OVACE Adultos',
    tieneManual: true,
  },
  
  // ===== Shock =====
  {
    protocoloId: 'shock-hemorragico',
    protocoloRuta: '/shock',
    protocoloTitulo: 'Shock Hemorrágico',
    // No tiene guía formativa
    tieneGuia: false,
    manualBloque: 'BLOQUE_11_0',
    manualRuta: '/manual/parte-xi-protocolos-trauma/bloque-11-trauma/11.1.1',
    manualTitulo: 'Protocolos Trauma',
    tieneManual: true,
  },
];

/**
 * Guías sin protocolo operativo (solo formativas)
 * 
 * Estas guías son formativas puras, accesibles desde:
 * - Menú "Guías de Refuerzo"
 * - Búsqueda
 * - Enlaces relacionados
 */
export const guiasSinProtocolo: Omit<ProtocolGuideManualMapping, 'protocoloId' | 'protocoloRuta' | 'protocoloTitulo'>[] = [
  {
    guiaId: 'rcp-lactantes',
    guiaRuta: '/guias/rcp-lactantes',
    guiaTitulo: 'RCP Lactantes',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_3',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.5',
    manualTitulo: 'RCP Lactantes',
    tieneManual: true,
  },
  {
    guiaId: 'ovace-pediatrica',
    guiaRuta: '/guias/ovace-pediatrica',
    guiaTitulo: 'OVACE Pediátrica',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_7',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.9',
    manualTitulo: 'OVACE Pediatría',
    tieneManual: true,
  },
  {
    guiaId: 'desa-adulto',
    guiaRuta: '/guias/desa-adulto',
    guiaTitulo: 'DESA Adulto',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_4',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.6',
    manualTitulo: 'Uso DESA',
    tieneManual: true,
  },
  {
    guiaId: 'parada-respiratoria',
    guiaRuta: '/guias/parada-respiratoria',
    guiaTitulo: 'Parada Respiratoria',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_0',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.2',
    manualTitulo: 'Reconocimiento PCR',
    tieneManual: true,
  },
  {
    guiaId: 'pcr-traumatica',
    guiaRuta: '/guias/pcr-traumatica',
    guiaTitulo: 'PCR Traumática',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_0',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.2',
    manualTitulo: 'Reconocimiento PCR',
    tieneManual: true,
  },
  {
    guiaId: 'reconocimiento-pcr',
    guiaRuta: '/guias/reconocimiento-pcr',
    guiaTitulo: 'Reconocimiento PCR',
    tieneGuia: true,
    manualBloque: 'BLOQUE_04_0',
    manualRuta: '/manual/parte-ii-soporte-vital/bloque-4-rcp/2.1.2',
    manualTitulo: 'Reconocimiento PCR',
    tieneManual: true,
  },
  {
    protocoloId: 'abcde-operativo',
    protocoloRuta: '/escena?tab=abcde',
    protocoloTitulo: 'ABCDE Operativo',
    guiaId: 'abcde-operativo',
    guiaRuta: '/guias/abcde-operativo',
    guiaTitulo: 'ABCDE Operativo',
    tieneGuia: true,
    manualBloque: 'BLOQUE_01_2',
    manualRuta: '/manual/parte-i-fundamentos/bloque-1-procedimientos/1.2.2',
    manualTitulo: 'ABCDE Operativo',
    tieneManual: true,
  },
];

/**
 * Obtiene el mapeo para un protocolo específico
 * 
 * ⚠️ ADVERTENCIA: Esta función puede retornar undefined.
 * Usar getMappingByProtocolIdSafe() para validación explícita.
 */
export function getMappingByProtocolId(protocoloId: string): ProtocolGuideManualMapping | undefined {
  if (!protocoloId || typeof protocoloId !== 'string' || protocoloId.trim().length === 0) {
    return undefined;
  }
  return protocolGuideManualMapping.find(m => m.protocoloId === protocoloId);
}

/**
 * Obtiene el mapeo para un protocolo específico con validación explícita
 * 
 * @param protocoloId - ID del protocolo
 * @returns Resultado seguro con validación explícita
 */
export function getMappingByProtocolIdSafe(protocoloId: string): {
  success: boolean;
  data?: ProtocolGuideManualMapping;
  error?: Error;
} {
  if (!protocoloId || typeof protocoloId !== 'string' || protocoloId.trim().length === 0) {
    return {
      success: false,
      error: new Error('ID de protocolo inválido o vacío'),
    };
  }
  
  const found = protocolGuideManualMapping.find(m => m.protocoloId === protocoloId);
  
  if (!found) {
    return {
      success: false,
      error: new Error(`Mapeo para protocolo "${protocoloId}" no encontrado`),
    };
  }
  
  return {
    success: true,
    data: found,
  };
}

/**
 * Obtiene el mapeo para una guía específica
 */
export function getMappingByGuiaId(guiaId: string): ProtocolGuideManualMapping | Omit<ProtocolGuideManualMapping, 'protocoloId' | 'protocoloRuta' | 'protocoloTitulo'> | undefined {
  const protocoloMapping = protocolGuideManualMapping.find(m => m.guiaId === guiaId);
  if (protocoloMapping) return protocoloMapping;
  
  return guiasSinProtocolo.find(g => g.guiaId === guiaId);
}

/**
 * Obtiene todas las guías disponibles (con y sin protocolo)
 */
export function getAllGuias(): Array<{ guiaId: string; guiaRuta?: string; guiaTitulo?: string; tieneProtocolo: boolean }> {
  const guiasConProtocolo = protocolGuideManualMapping
    .filter(m => m.tieneGuia)
    .map(m => ({
      guiaId: m.guiaId!,
      guiaRuta: m.guiaRuta,
      guiaTitulo: m.guiaTitulo,
      tieneProtocolo: true,
    }));
  
  const guiasSinProtocoloList = guiasSinProtocolo.map(g => ({
    guiaId: g.guiaId!,
    guiaRuta: g.guiaRuta,
    guiaTitulo: g.guiaTitulo,
    tieneProtocolo: false,
  }));
  
  return [...guiasConProtocolo, ...guiasSinProtocoloList];
}

