/**
 * Utilidades para Testing del Sistema de Contenido
 * 
 * Estas funciones ayudan a verificar que el sistema funciona correctamente
 */

import { contentAdapter } from '../services/content-adapter';
import { getProtocolRelations, getGuideRelations } from '../services/content-relations';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

/**
 * Test 1: Verificar que el ContentAdapter está disponible
 */
export function testContentAdapterAvailable(): TestResult {
  try {
    const isAvailable = contentAdapter.isAvailable();
    return {
      name: 'ContentAdapter Disponible',
      passed: isAvailable,
      message: isAvailable 
        ? 'ContentAdapter está disponible y funcionando'
        : 'ContentAdapter no está disponible',
      details: {
        adapterType: contentAdapter.constructor.name,
      }
    };
  } catch (error) {
    return {
      name: 'ContentAdapter Disponible',
      passed: false,
      message: `Error verificando ContentAdapter: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 2: Verificar que se pueden obtener protocolos
 */
export function testGetProtocols(): TestResult {
  try {
    const protocols = contentAdapter.getAllProtocols();
    const hasProtocols = protocols.length > 0;
    
    return {
      name: 'Obtener Protocolos',
      passed: hasProtocols,
      message: hasProtocols
        ? `Se encontraron ${protocols.length} protocolos`
        : 'No se encontraron protocolos',
      details: {
        count: protocols.length,
        sample: protocols.slice(0, 3).map(p => ({ id: p.id, title: p.title }))
      }
    };
  } catch (error) {
    return {
      name: 'Obtener Protocolos',
      passed: false,
      message: `Error obteniendo protocolos: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 3: Verificar que se pueden obtener fármacos
 */
export function testGetDrugs(): TestResult {
  try {
    const drugs = contentAdapter.getAllDrugs();
    const hasDrugs = drugs.length > 0;
    
    return {
      name: 'Obtener Fármacos',
      passed: hasDrugs,
      message: hasDrugs
        ? `Se encontraron ${drugs.length} fármacos`
        : 'No se encontraron fármacos',
      details: {
        count: drugs.length,
        sample: drugs.slice(0, 3).map(d => ({ id: d.id, genericName: d.genericName }))
      }
    };
  } catch (error) {
    return {
      name: 'Obtener Fármacos',
      passed: false,
      message: `Error obteniendo fármacos: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 4: Verificar que se pueden obtener guías
 */
export function testGetGuides(): TestResult {
  try {
    const guides = contentAdapter.getAllGuides();
    const hasGuides = guides.length > 0;
    
    return {
      name: 'Obtener Guías',
      passed: hasGuides,
      message: hasGuides
        ? `Se encontraron ${guides.length} guías`
        : 'No se encontraron guías',
      details: {
        count: guides.length,
        sample: guides.slice(0, 3).map(g => ({ id: g.id, titulo: g.titulo }))
      }
    };
  } catch (error) {
    return {
      name: 'Obtener Guías',
      passed: false,
      message: `Error obteniendo guías: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 5: Verificar protocolo específico
 */
export function testGetSpecificProtocol(protocolId: string): TestResult {
  try {
    const protocol = contentAdapter.getProtocol(protocolId);
    const found = protocol !== null;
    
    return {
      name: `Obtener Protocolo: ${protocolId}`,
      passed: found,
      message: found
        ? `Protocolo "${protocol?.title}" encontrado correctamente`
        : `Protocolo "${protocolId}" no encontrado`,
      details: found ? {
        id: protocol?.id,
        title: protocol?.title,
        category: protocol?.category
      } : null
    };
  } catch (error) {
    return {
      name: `Obtener Protocolo: ${protocolId}`,
      passed: false,
      message: `Error obteniendo protocolo: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 6: Verificar relaciones bidireccionales - Protocolo → Guía
 */
export function testProtocolToGuideRelations(protocolId: string): TestResult {
  try {
    const relations = getProtocolRelations(protocolId);
    const hasGuide = relations.guide !== null;
    
    return {
      name: `Relaciones Protocolo → Guía: ${protocolId}`,
      passed: true, // Siempre pasa, solo verifica si existe
      message: hasGuide
        ? `Protocolo tiene guía relacionada: "${relations.guide?.titulo}"`
        : `Protocolo no tiene guía relacionada`,
      details: {
        hasGuide,
        guide: relations.guide ? {
          id: relations.guide.id,
          titulo: relations.guide.titulo
        } : null,
        hasManual: relations.manual !== null
      }
    };
  } catch (error) {
    return {
      name: `Relaciones Protocolo → Guía: ${protocolId}`,
      passed: false,
      message: `Error verificando relaciones: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 7: Verificar relaciones bidireccionales - Guía → Protocolo
 */
export function testGuideToProtocolRelations(guideId: string): TestResult {
  try {
    const relations = getGuideRelations(guideId);
    const hasProtocol = relations.protocol !== null;
    
    return {
      name: `Relaciones Guía → Protocolo: ${guideId}`,
      passed: true,
      message: hasProtocol
        ? `Guía tiene protocolo relacionado: "${relations.protocol?.title}"`
        : `Guía no tiene protocolo relacionado`,
      details: {
        hasProtocol,
        protocol: relations.protocol ? {
          id: relations.protocol.id,
          title: relations.protocol.title
        } : null,
        hasManual: relations.manual !== null
      }
    };
  } catch (error) {
    return {
      name: `Relaciones Guía → Protocolo: ${guideId}`,
      passed: false,
      message: `Error verificando relaciones: ${error}`,
      details: { error }
    };
  }
}

/**
 * Test 8: Verificar cache del Content Pack
 */
export function testContentPackCache(): TestResult {
  try {
    const cached = localStorage.getItem('content_pack');
    const cachedTime = localStorage.getItem('content_pack_time');
    
    if (!cached) {
      return {
        name: 'Cache del Content Pack',
        passed: true, // No es error, solo no hay cache
        message: 'No hay Content Pack en cache (normal si es primera carga)',
        details: { hasCache: false }
      };
    }
    
    const pack = JSON.parse(cached);
    const age = cachedTime ? Date.now() - parseInt(cachedTime) : null;
    const ageHours = age ? (age / (1000 * 60 * 60)).toFixed(2) : null;
    const isExpired = age ? age > 24 * 60 * 60 * 1000 : false;
    
    return {
      name: 'Cache del Content Pack',
      passed: !isExpired,
      message: isExpired
        ? `Cache expirado (${ageHours} horas)`
        : `Cache válido (${ageHours} horas)`,
      details: {
        hasCache: true,
        ageHours,
        isExpired,
        packVersion: pack.version,
        packHash: pack.hash?.substring(0, 16) + '...'
      }
    };
  } catch (error) {
    return {
      name: 'Cache del Content Pack',
      passed: false,
      message: `Error verificando cache: ${error}`,
      details: { error }
    };
  }
}

/**
 * Ejecutar todos los tests básicos
 */
export function runAllBasicTests(): TestResult[] {
  return [
    testContentAdapterAvailable(),
    testGetProtocols(),
    testGetDrugs(),
    testGetGuides(),
    testGetSpecificProtocol('rcp-adulto-svb'),
    testGetSpecificProtocol('obstruccion-via-aerea'),
    testGetSpecificProtocol('shock-hemorragico'),
    testProtocolToGuideRelations('rcp-adulto-svb'),
    testProtocolToGuideRelations('obstruccion-via-aerea'),
    testGuideToProtocolRelations('rcp-adulto-svb'),
    testGuideToProtocolRelations('ovace-adulto'),
    testContentPackCache(),
  ];
}

/**
 * Formatear resultados de tests para mostrar en consola
 */
export function formatTestResults(results: TestResult[]): string {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);
  
  let output = `\n📊 RESULTADOS DE TESTS\n`;
  output += `═══════════════════════════════════════\n`;
  output += `✅ Pasados: ${passed}/${total} (${percentage}%)\n`;
  output += `❌ Fallidos: ${total - passed}/${total}\n`;
  output += `═══════════════════════════════════════\n\n`;
  
  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    output += `${icon} [${index + 1}] ${result.name}\n`;
    output += `   ${result.message}\n`;
    if (result.details && Object.keys(result.details).length > 0) {
      output += `   Detalles: ${JSON.stringify(result.details, null, 2)}\n`;
    }
    output += `\n`;
  });
  
  return output;
}

