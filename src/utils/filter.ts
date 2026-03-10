/**
 * Utilidades genéricas de filtrado
 * Elimina duplicación entre drugs y procedures
 */

/**
 * Buscar en un array de objetos por múltiples campos
 */
export function searchInArray<T>(
  items: T[],
  query: string,
  searchFields: Array<(item: T) => string | string[] | undefined>
): T[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return items.filter((item) => {
    return searchFields.some((getField) => {
      const fieldValue = getField(item);
      
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(lowerQuery);
      }
      
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((val) => 
          typeof val === 'string' && val.toLowerCase().includes(lowerQuery)
        );
      }
      
      return false;
    });
  });
}

/**
 * Filtrar por categoría
 */
export function filterByCategory<T extends { category: string }>(
  items: T[],
  category: string | 'todos'
): T[] {
  if (category === 'todos') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

/**
 * Ordenar destacando un ID específico
 */
export function highlightItem<T extends { id: string }>(
  items: T[],
  highlightId: string | null
): T[] {
  if (!highlightId) {
    return items;
  }

  return [...items].sort((a, b) => {
    if (a.id === highlightId) return -1;
    if (b.id === highlightId) return 1;
    return 0;
  });
}

/**
 * Buscar por ID
 */
export function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}
