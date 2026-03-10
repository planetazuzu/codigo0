/**
 * Diccionario de siglas y acrónimos TES
 * 
 * Este archivo permite expandir siglas comunes del ámbito TES a sus términos completos
 * para mejorar la búsqueda sin modificar las funciones de búsqueda existentes.
 * 
 * IMPORTANTE: Este diccionario es estático y offline-compatible.
 * No modificar searchProcedures() ni searchDrugs() - la expansión se hace en SearchModal.tsx
 */

export type AcronymMap = {
  acronym: string;
  expanded: string[];
};

/**
 * Diccionario de siglas comunes del ámbito TES
 * 
 * Formato: sigla → array de términos expandidos
 * La búsqueda buscará la sigla original + todos los términos expandidos (OR)
 */
export const acronymMappings: AcronymMap[] = [
  {
    acronym: 'RCP',
    expanded: ['reanimación cardiopulmonar', 'parada cardiorrespiratoria'],
  },
  {
    acronym: 'PCR',
    expanded: ['parada cardiorrespiratoria', 'reanimación cardiopulmonar'],
  },
  {
    acronym: 'OVACE',
    expanded: ['obstrucción vía aérea', 'cuerpo extraño', 'vía aérea'],
  },
  {
    acronym: 'EAP',
    expanded: ['enfermedad arterial periférica'],
  },
  {
    acronym: 'SVB',
    expanded: ['soporte vital básico'],
  },
  {
    acronym: 'SVA',
    expanded: ['soporte vital avanzado'],
  },
];

/**
 * Expande una sigla a sus términos relacionados
 * 
 * @param acronym - La sigla a expandir (ej: "OVACE")
 * @returns Array de términos expandidos (ej: ["obstrucción vía aérea", "cuerpo extraño"])
 *          Retorna array vacío si la sigla no está en el diccionario
 * 
 * IMPORTANTE: Case-insensitive. "ovace" y "OVACE" se tratan igual.
 */
export function expandAcronym(acronym: string): string[] {
  const upperAcronym = acronym.toUpperCase().trim();
  const mapping = acronymMappings.find(m => m.acronym.toUpperCase() === upperAcronym);
  return mapping ? mapping.expanded : [];
}

/**
 * Expande una query completa, manteniendo el input original y añadiendo términos expandidos
 * 
 * Estrategia: Si la query contiene una sigla conocida, se expande a:
 * "SIGLA término1 término2 ..." para que la búsqueda con .includes() encuentre cualquiera
 * 
 * Ejemplo:
 * - Input: "OVACE"
 * - Output: "OVACE obstrucción vía aérea cuerpo extraño"
 * 
 * Esto permite que la búsqueda encuentre:
 * - Protocolos con "OVACE" en el título (match exacto)
 * - Protocolos con "obstrucción vía aérea" en el título (match expandido)
 * 
 * @param query - Query original del usuario
 * @returns Query expandida con términos adicionales, o query original si no hay siglas
 * 
 * IMPORTANTE: El input original SIEMPRE se mantiene para priorizar matches exactos
 */
export function expandQueryWithAcronyms(query: string): string {
  if (!query || query.trim().length === 0) {
    return query;
  }

  // Dividir query en términos (por espacios)
  const terms = query.trim().split(/\s+/);
  const expandedTerms: string[] = [];

  for (const term of terms) {
    // Añadir término original (SIEMPRE se mantiene)
    expandedTerms.push(term);

    // Si el término es una sigla conocida, añadir términos expandidos
    const expanded = expandAcronym(term);
    if (expanded.length > 0) {
      expandedTerms.push(...expanded);
    }
  }

  // Retornar query original + términos expandidos unidos por espacios
  // La búsqueda con .includes() encontrará cualquiera de estos términos (OR)
  return expandedTerms.join(' ');
}
