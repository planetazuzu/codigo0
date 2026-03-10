/**
 * SERVICIO DE BÚSQUEDA - ContentAdapter
 * 
 * Abstrae la búsqueda de contenido usando ContentAdapter
 * Reemplaza las funciones searchProcedures y searchDrugs de src/data/
 */

import { getAllProtocols, getAllDrugs } from './content-adapter';
import type { Procedure } from '../data/procedures';
import type { Drug } from '../data/drugs';

/**
 * Busca protocolos usando ContentAdapter
 */
export function searchProcedures(query: string): Procedure[] {
  const allProtocols = getAllProtocols();
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 2) {
    return [];
  }
  
  return allProtocols.filter((procedure) => {
    const titleMatch = procedure.title.toLowerCase().includes(normalizedQuery);
    const shortTitleMatch = procedure.shortTitle?.toLowerCase().includes(normalizedQuery);
    const categoryMatch = procedure.category.toLowerCase().includes(normalizedQuery);
    const stepsMatch = procedure.steps.some(step => 
      step.toLowerCase().includes(normalizedQuery)
    );
    
    return titleMatch || shortTitleMatch || categoryMatch || stepsMatch;
  });
}

/**
 * Busca fármacos usando ContentAdapter
 */
export function searchDrugs(query: string): Drug[] {
  const allDrugs = getAllDrugs();
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 2) {
    return [];
  }
  
  return allDrugs.filter((drug) => {
    const genericNameMatch = drug.genericName.toLowerCase().includes(normalizedQuery);
    const tradeNameMatch = drug.tradeName?.toLowerCase().includes(normalizedQuery);
    const categoryMatch = drug.category.toLowerCase().includes(normalizedQuery);
    const indicationsMatch = drug.indications.some(ind => 
      ind.toLowerCase().includes(normalizedQuery)
    );
    
    return genericNameMatch || tradeNameMatch || categoryMatch || indicationsMatch;
  });
}

