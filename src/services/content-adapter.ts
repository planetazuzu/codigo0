/**
 * CONTENT ADAPTER - Sistema de contenido externo
 * 
 * ⚠️ REGLAS CRÍTICAS:
 * - NO modifica código existente
 * - TODO es aditivo y desacoplado
 * - Fallback total a datos locales
 * - La app funciona igual si este sistema falla
 */

import { useState, useEffect } from 'react';
import type { Procedure } from '../data/procedures';
import type { Drug, DrugCategory } from '../data/drugs';
import { procedures } from '../data/procedures';
import { drugs } from '../data/drugs';
import { guidesIndex, getGuideSection as getLocalGuideSection } from '../data/guides-index';

// ============================================
// TIPOS - Content Pack
// ============================================

export interface ContentPack {
  metadata: {
    version: string;
    generated_at: string;
    hash: string;
    total_items: number;
  };
  content: {
    protocols: ContentItem[];
    guides: ContentItem[];
    drugs: ContentItem[];
    checklists: ContentItem[];
  };
  media: {
    resources: MediaResource[];
    associations: ContentResourceAssociation[];
  };
}

export interface ContentItem {
  id: string;
  type: 'protocol' | 'guide' | 'drug' | 'checklist' | 'manual';
  slug: string;
  title: string;
  shortTitle?: string;
  description?: string;
  content: any; // JSON estructurado
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  version: string;
}

export interface MediaResource {
  id: string;
  type: 'image' | 'video';
  file_path: string;
  alt_text?: string;
  caption?: string;
  tags?: string[];
}

export interface ContentResourceAssociation {
  content_id: string;
  resource_id: string;
  position?: number;
  context?: string;
}

// ============================================
// INTERFACES - Adapters
// ============================================

export interface Guide {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  secciones: Array<{
    numero: number;
    titulo: string;
    archivo: string;
    ruta: string;
  }>;
  protocoloOperativo?: {
    titulo: string;
    ruta: string;
  };
  scormAvailable?: boolean;
}

export interface ContentAdapter {
  getProtocol(id: string): Procedure | null;
  getDrug(id: string): Drug | null;
  getGuide(id: string): Guide | null;
  getGuideSection(guideId: string, numero: number): Guide['secciones'][0] | null;
  getAllProtocols(): Procedure[];
  getAllDrugs(): Drug[];
  getAllGuides(): Guide[];
  isAvailable(): boolean;
}

// ============================================
// ADAPTER 1: LocalContentAdapter
// ============================================
// Usa los datos actuales de la app (fallback)

class LocalContentAdapter implements ContentAdapter {
  isAvailable(): boolean {
    return true; // Siempre disponible
  }

  getProtocol(id: string): Procedure | null {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return null;
    }
    if (!procedures || !Array.isArray(procedures)) {
      return null;
    }
    return procedures.find(p => p && typeof p === 'object' && 'id' in p && p.id === id) || null;
  }

  getDrug(id: string): Drug | null {
    return drugs.find(d => d.id === id) || null;
  }

  getAllProtocols(): Procedure[] {
    if (!procedures || !Array.isArray(procedures)) {
      return [];
    }
    return procedures.filter((p): p is Procedure => p != null && typeof p === 'object' && 'id' in p);
  }

  getAllDrugs(): Drug[] {
    if (!drugs || !Array.isArray(drugs)) {
      return [];
    }
    return drugs.filter((d): d is Drug => d != null && typeof d === 'object' && 'id' in d);
  }

  getGuide(id: string): Guide | null {
    try {
      return guidesIndex.find((g: Guide) => g.id === id) || null;
    } catch (error) {
      console.warn('[ContentAdapter] Error cargando guía local:', error);
      return null;
    }
  }

  getAllGuides(): Guide[] {
    try {
      return guidesIndex || [];
    } catch (error) {
      console.warn('[ContentAdapter] Error cargando guías locales:', error);
      return [];
    }
  }

  getGuideSection(guideId: string, numero: number): Guide['secciones'][0] | null {
    try {
      return getLocalGuideSection(guideId, numero) || null;
    } catch (error) {
      console.warn('[ContentAdapter] Error cargando sección de guía local:', error);
      return null;
    }
  }
}

// ============================================
// ADAPTER 2: ExternalContentAdapter
// ============================================
// Usa Content Pack JSON (si está disponible)

class ExternalContentAdapter implements ContentAdapter {
  private pack: ContentPack | null = null;
  private loaded = false;

  constructor() {
    this.loadPack();
  }

  private async loadPack() {
    try {
      // Intentar cargar desde cache (IndexedDB)
      const cached = await this.getCachedPack();
      if (cached) {
        this.pack = cached;
        this.loaded = true;
        return;
      }

      // Intentar descargar desde servidor
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const packUrl = apiUrl ? `${apiUrl}/api/content-pack/latest.json` : '/api/content-pack/latest.json';
      const response = await fetch(packUrl, {
        cache: 'no-cache',
      });
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Silenciar warning si es HTML (normal cuando no hay pack externo configurado)
          if (!contentType.includes('text/html')) {
            console.warn('[ContentAdapter] Content Pack inválido (no JSON):', contentType);
          }
          this.loaded = true;
          return;
        }
        const pack = await response.json();
        this.pack = pack;
        this.loaded = true;
        // Guardar en cache
        await this.cachePack(pack);
      }
    } catch (error) {
      console.warn('[ContentAdapter] No se pudo cargar Content Pack:', error);
      this.loaded = true; // Marcar como cargado para no intentar de nuevo
    }
  }

  private async getCachedPack(): Promise<ContentPack | null> {
    try {
      // Intentar usar IndexedDB primero (más eficiente)
      const { getContentPack } = await import('../utils/indexeddb');
      const cached = await getContentPack();
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.warn('[ContentAdapter] Error leyendo cache IndexedDB, usando fallback:', error);
      // Fallback a localStorage
      try {
        const cached = localStorage.getItem('content_pack');
        if (cached) {
          const pack = JSON.parse(cached);
          // Verificar que no esté expirado (24 horas)
          const cachedAt = localStorage.getItem('content_pack_time');
          if (cachedAt) {
            const age = Date.now() - parseInt(cachedAt);
            if (age < 24 * 60 * 60 * 1000) {
              return pack;
            }
          }
        }
      } catch (localError) {
        console.warn('[ContentAdapter] Error leyendo cache localStorage:', localError);
      }
    }
    return null;
  }

  private async cachePack(pack: ContentPack) {
    try {
      // Intentar usar IndexedDB primero (más eficiente)
      const { saveContentPack } = await import('../utils/indexeddb');
      await saveContentPack(pack);
    } catch (error) {
      console.warn('[ContentAdapter] Error guardando cache IndexedDB, usando fallback:', error);
      // Fallback a localStorage
      try {
        localStorage.setItem('content_pack', JSON.stringify(pack));
        localStorage.setItem('content_pack_time', Date.now().toString());
      } catch (localError) {
        console.warn('[ContentAdapter] Error guardando cache localStorage:', localError);
      }
    }
  }

  isAvailable(): boolean {
    return this.pack !== null;
  }

  getProtocol(id: string): Procedure | null {
    if (!this.pack) return null;

    const protocol = this.pack.content.protocols.find(p => p.slug === id || p.id === id);
    if (!protocol || protocol.status !== 'published') return null;

    // Convertir ContentItem a Procedure
    return this.convertToProcedure(protocol);
  }

  getDrug(id: string): Drug | null {
    if (!this.pack) return null;

    const drug = this.pack.content.drugs.find(d => d.slug === id || d.id === id);
    if (!drug || drug.status !== 'published') return null;

    // Convertir ContentItem a Drug
    return this.convertToDrug(drug);
  }

  getAllProtocols(): Procedure[] {
    if (!this.pack) return [];

    return this.pack.content.protocols
      .filter(p => p.status === 'published')
      .map(p => this.convertToProcedure(p))
      .filter((p): p is Procedure => p !== null);
  }

  getAllDrugs(): Drug[] {
    if (!this.pack) return [];

    return this.pack.content.drugs
      .filter(d => d.status === 'published')
      .map(d => this.convertToDrug(d))
      .filter((d): d is Drug => d !== null);
  }

  getGuide(id: string): Guide | null {
    // Si el pack no está cargado, hacer fallback a datos locales
    if (!this.pack || !this.loaded) {
      try {
        const localGuide = guidesIndex.find((g: Guide) => g.id === id);
        if (localGuide) {
          console.log(`[ContentAdapter] Usando guía local: ${id}`);
          return localGuide;
        }
      } catch (error) {
        console.warn('[ContentAdapter] Error cargando guía local:', error);
      }
      return null;
    }

    const guide = this.pack.content.guides.find(g => g.slug === id || g.id === id);
    if (!guide || guide.status !== 'published') {
      // Si no está en el pack, intentar datos locales como fallback
      try {
        const localGuide = guidesIndex.find((g: Guide) => g.id === id);
        if (localGuide) {
          console.log(`[ContentAdapter] Guía no encontrada en pack, usando local: ${id}`);
          return localGuide;
        }
      } catch (error) {
        console.warn('[ContentAdapter] Error cargando guía local:', error);
      }
      return null;
    }

    // Convertir ContentItem a Guide
    const convertedGuide = this.convertToGuide(guide);
    
    // Si la conversión falla o no tiene secciones, usar datos locales
    if (!convertedGuide || !convertedGuide.secciones || convertedGuide.secciones.length === 0) {
      try {
        const localGuide = guidesIndex.find((g: Guide) => g.id === id);
        if (localGuide) {
          console.log(`[ContentAdapter] Guía del pack sin secciones, usando local: ${id}`);
          return localGuide;
        }
      } catch (error) {
        console.warn('[ContentAdapter] Error cargando guía local:', error);
      }
    }
    
    return convertedGuide;
  }

  getAllGuides(): Guide[] {
    // Si el pack aún no está cargado, hacer fallback a datos locales
    if (!this.pack || !this.loaded) {
      console.log('[ContentAdapter] Usando guías locales (pack no cargado aún)');
      return guidesIndex || [];
    }

    const guides = this.pack.content.guides
      .filter(g => g.status === 'published')
      .map(g => this.convertToGuide(g))
      .filter((g): g is Guide => g !== null);
    
    // Si no hay guías en el pack o están vacías, hacer fallback a locales
    if (guides.length === 0) {
      console.log('[ContentAdapter] Pack no tiene guías, usando locales');
      return guidesIndex || [];
    }
    
    return guides;
  }

  getGuideSection(guideId: string, numero: number): Guide['secciones'][0] | null {
    const guide = this.getGuide(guideId);
    if (!guide) return null;
    return guide.secciones.find(s => s.numero === numero) || null;
  }

  private mapCategory(category: string): DrugCategory | null {
    const categoryMap: Record<string, DrugCategory> = {
      'cardiovascular': 'cardiovascular',
      'respiratorio': 'respiratorio',
      'neurologico': 'neurologico',
      'analgesico': 'analgesia',
      'analgesia': 'analgesia',
      'oxigenoterapia': 'oxigenoterapia',
      'fluidos': 'otros',
      'antidoto': 'otros',
      'hemostatico': 'otros',
      'diuretico': 'otros',
      'corticosteroide': 'otros',
      'antiepileptico': 'otros',
      'anestesico': 'otros',
      'metabolico': 'otros',
      'antiagregante': 'otros',
      'otros': 'otros',
    };
    return categoryMap[category?.toLowerCase()] || null;
  }

  private mapRoute(route: string): string {
    // Mapear rutas del Content Pack a formato de la app
    const routeMap: Record<string, string> = {
      'IV': 'IV',
      'IO': 'IO',
      'IM': 'IM',
      'Subcutánea': 'SC',
      'Oral': 'Oral',
      'Rectal': 'Rectal',
      'Intranasal': 'Nasal',
      'Nebulización': 'Nebulizado',
      'MDI': 'MDI',
      'Inhalación': 'Inhalatoria',
    };
    return routeMap[route] || route;
  }

  private convertToProcedure(item: ContentItem): Procedure | null {
    try {
      const content = item.content;
      return {
        id: item.slug,
        title: item.title,
        shortTitle: item.shortTitle || item.title,
        category: content.category || 'soporte_vital',
        subcategory: content.subcategory,
        priority: this.mapPriority(item.priority),
        ageGroup: content.ageGroup || 'adulto',
        steps: content.steps?.map((s: any) => s.text || s) || [],
        warnings: content.warnings || [],
        keyPoints: content.keyPoints || [],
        equipment: content.equipment || [],
        drugs: content.drugs || [],
      };
    } catch (error) {
      console.warn('[ContentAdapter] Error convirtiendo protocolo:', error);
      return null;
    }
  }

  private convertToDrug(item: any): Drug | null {
    try {
      // El Content Pack para drugs viene con estructura directa (no en content)
      // Verificar si viene del formato nuevo (directo) o antiguo (content)
      const drugData = item.genericName ? item : item.content;
      
      // Normalizar sideEffects: puede venir como string o array
      let sideEffects: string[] | undefined = undefined;
      if (drugData.sideEffects) {
        if (typeof drugData.sideEffects === 'string') {
          sideEffects = [drugData.sideEffects];
        } else if (Array.isArray(drugData.sideEffects)) {
          sideEffects = drugData.sideEffects;
        }
      }
      
      return {
        id: item.slug || item.id,
        genericName: drugData.genericName || item.title || '',
        tradeName: drugData.tradeName || item.shortTitle || null,
        category: this.mapCategory(drugData.category) || 'otros',
        presentation: drugData.presentation || '',
        adultDose: drugData.adultDose || '',
        pediatricDose: drugData.pediatricDose || null,
        routes: (drugData.routes || []).map((r: string) => this.mapRoute(r)),
        dilution: drugData.dilution || null,
        indications: drugData.indications || [],
        contraindications: drugData.contraindications || [],
        sideEffects: sideEffects,
        antidote: drugData.antidote || null,
        notes: drugData.notes || [],
        criticalPoints: drugData.criticalPoints || [],
        source: drugData.source || null,
      };
    } catch (error) {
      console.warn('[ContentAdapter] Error convirtiendo fármaco:', error);
      return null;
    }
  }

  private convertToGuide(item: ContentItem): Guide | null {
    try {
      const content = item.content;
      
      // Si las secciones están vacías en el Content Pack, intentar cargarlas desde datos locales
      let secciones = content.secciones || [];
      if (secciones.length === 0) {
        try {
          const localGuide = guidesIndex.find((g: Guide) => g.id === item.slug);
          if (localGuide && localGuide.secciones) {
            secciones = localGuide.secciones;
            console.log(`[ContentAdapter] Cargando secciones locales para guía ${item.slug}`);
          }
        } catch (error) {
          console.warn('[ContentAdapter] No se pudieron cargar secciones locales:', error);
        }
      }
      
      return {
        id: item.slug,
        titulo: item.title,
        descripcion: item.description || '',
        icono: content.icono || 'BookOpen',
        secciones: secciones,
        protocoloOperativo: content.protocoloOperativo,
        scormAvailable: content.scormAvailable || false,
      };
    } catch (error) {
      console.warn('[ContentAdapter] Error convirtiendo guía:', error);
      return null;
    }
  }

  private mapPriority(priority: string): 'critico' | 'alto' | 'medio' | 'bajo' {
    const map: Record<string, 'critico' | 'alto' | 'medio' | 'bajo'> = {
      critical: 'critico',
      high: 'alto',
      medium: 'medio',
      low: 'bajo',
    };
    return map[priority] || 'medio';
  }
}

// ============================================
// FACTORY - Decide qué adapter usar
// ============================================

class ContentAdapterFactory {
  private static instance: ContentAdapter | null = null;
  private static externalAdapter: ExternalContentAdapter | null = null;
  private static localAdapter: LocalContentAdapter | null = null;

  static getAdapter(): ContentAdapter {
    // Crear adapters si no existen
    if (!this.externalAdapter) {
      this.externalAdapter = new ExternalContentAdapter();
    }
    if (!this.localAdapter) {
      this.localAdapter = new LocalContentAdapter();
    }

    // Intentar usar external primero, fallback a local
    if (this.externalAdapter.isAvailable()) {
      return this.externalAdapter;
    }

    return this.localAdapter;
  }

  static async refreshPack(): Promise<void> {
    if (this.externalAdapter) {
      // Forzar recarga del pack
      await (this.externalAdapter as any).loadPack();
    }
  }
}

// ============================================
// EXPORT - API Pública
// ============================================

export const contentAdapter = ContentAdapterFactory.getAdapter();

export function getProtocol(id: string): Procedure | null {
  return contentAdapter.getProtocol(id);
}

export function getDrug(id: string): Drug | null {
  return contentAdapter.getDrug(id);
}

export function getAllProtocols(): Procedure[] {
  return contentAdapter.getAllProtocols();
}

export function getAllDrugs(): Drug[] {
  return contentAdapter.getAllDrugs();
}

export function getGuide(id: string): Guide | null {
  return contentAdapter.getGuide(id);
}

export function getAllGuides(): Guide[] {
  return contentAdapter.getAllGuides();
}

export function getGuideSection(guideId: string, numero: number): Guide['secciones'][0] | null {
  return contentAdapter.getGuideSection(guideId, numero);
}

export async function refreshContentPack(): Promise<void> {
  await ContentAdapterFactory.refreshPack();
}

// ============================================
// HOOKS REACT (Opcional - para componentes)
// ============================================

export function useContentAdapter() {
  const [isExternal, setIsExternal] = useState(false);
  
  useEffect(() => {
    // Verificar si estamos usando el adapter externo
    setIsExternal(contentAdapter instanceof ExternalContentAdapter && contentAdapter.isAvailable());
  }, []);

  return {
    adapter: contentAdapter,
    getProtocol: (id: string) => contentAdapter.getProtocol(id),
    getDrug: (id: string) => contentAdapter.getDrug(id),
    getGuide: (id: string) => contentAdapter.getGuide(id),
    getAllProtocols: () => contentAdapter.getAllProtocols(),
    getAllDrugs: () => contentAdapter.getAllDrugs(),
    getAllGuides: () => contentAdapter.getAllGuides(),
    refresh: refreshContentPack,
    isExternal, // Indica si está usando contenido externo
  };
}

/**
 * Hook para obtener un protocolo con ContentAdapter
 * Similar a useProtocol pero usando el nuevo ContentAdapter
 */
export function useProtocolAdapter(protocolId: string) {
  const [protocol, setProtocol] = useState<Procedure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    const loadProtocol = async () => {
      try {
        setIsLoading(true);
        
        // Obtener protocolo usando ContentAdapter
        const loadedProtocol = contentAdapter.getProtocol(protocolId);
        
        // Verificar si viene del adapter externo
        const isFromExternal = contentAdapter instanceof ExternalContentAdapter && 
                              (contentAdapter as ExternalContentAdapter).isAvailable();
        
        setProtocol(loadedProtocol);
        setIsExternal(isFromExternal);
      } catch (err) {
        console.error('Error cargando protocolo:', err);
        setProtocol(null);
        setIsExternal(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadProtocol();
  }, [protocolId]);

  return {
    protocol,
    isLoading,
    isExternal,
  };
}

/**
 * Hook para obtener una guía con ContentAdapter
 */
export function useGuideAdapter(guideId: string) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setIsLoading(true);
        
        // Obtener guía usando ContentAdapter
        const loadedGuide = contentAdapter.getGuide(guideId);
        
        // Verificar si viene del adapter externo
        const isFromExternal = contentAdapter instanceof ExternalContentAdapter && 
                              (contentAdapter as ExternalContentAdapter).isAvailable();
        
        setGuide(loadedGuide);
        setIsExternal(isFromExternal);
      } catch (err) {
        console.error('Error cargando guía:', err);
        setGuide(null);
        setIsExternal(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuide();
  }, [guideId]);

  return {
    guide,
    isLoading,
    isExternal,
  };
}

