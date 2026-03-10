/**
 * Utilidades para IndexedDB
 * 
 * Proporciona una interfaz simple para almacenar y recuperar
 * el Content Pack usando IndexedDB (más eficiente que localStorage)
 */

const DB_NAME = 'guia-tes-content';
const DB_VERSION = 1;
const STORE_NAME = 'content-pack';

interface DBSchema {
  key: string;
  value: any;
  timestamp: number;
}

let db: IDBDatabase | null = null;

/**
 * Inicializar IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.warn('[IndexedDB] Error abriendo base de datos:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Crear object store si no existe
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Guardar Content Pack en IndexedDB
 */
export async function saveContentPack(pack: any): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data: DBSchema = {
      key: 'content_pack',
      value: pack,
      timestamp: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('[IndexedDB] Error guardando Content Pack:', error);
    // Fallback a localStorage
    try {
      localStorage.setItem('content_pack', JSON.stringify(pack));
      localStorage.setItem('content_pack_time', Date.now().toString());
    } catch (localError) {
      console.error('[IndexedDB] Error en fallback a localStorage:', localError);
    }
  }
}

/**
 * Obtener Content Pack de IndexedDB
 */
export async function getContentPack(maxAge?: number): Promise<any | null> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const data = await new Promise<DBSchema | null>((resolve, reject) => {
      const request = store.get('content_pack');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    if (!data) {
      return null;
    }

    // Verificar expiración (por defecto 24 horas)
    const maxAgeMs = maxAge || (24 * 60 * 60 * 1000);
    const age = Date.now() - data.timestamp;
    
    if (age > maxAgeMs) {
      // Cache expirado, eliminar
      await deleteContentPack();
      return null;
    }

    return data.value;
  } catch (error) {
    console.warn('[IndexedDB] Error obteniendo Content Pack:', error);
    // Fallback a localStorage
    try {
      const cached = localStorage.getItem('content_pack');
      if (!cached) {
        return null;
      }

      const cachedTime = localStorage.getItem('content_pack_time');
      if (cachedTime) {
        const maxAgeMs = maxAge || (24 * 60 * 60 * 1000);
        const age = Date.now() - parseInt(cachedTime);
        if (age > maxAgeMs) {
          localStorage.removeItem('content_pack');
          localStorage.removeItem('content_pack_time');
          return null;
        }
      }

      return JSON.parse(cached);
    } catch (localError) {
      console.error('[IndexedDB] Error en fallback a localStorage:', localError);
      return null;
    }
  }
}

/**
 * Eliminar Content Pack de IndexedDB
 */
export async function deleteContentPack(): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete('content_pack');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('[IndexedDB] Error eliminando Content Pack:', error);
    // Fallback a localStorage
    try {
      localStorage.removeItem('content_pack');
      localStorage.removeItem('content_pack_time');
    } catch (localError) {
      console.error('[IndexedDB] Error en fallback a localStorage:', localError);
    }
  }
}

/**
 * Obtener información del cache
 */
export async function getCacheInfo(): Promise<{
  exists: boolean;
  age: number;
  ageHours: number;
  size: number;
}> {
  try {
    const pack = await getContentPack();
    if (!pack) {
      return {
        exists: false,
        age: 0,
        ageHours: 0,
        size: 0,
      };
    }

    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const data = await new Promise<DBSchema | null>((resolve, reject) => {
      const request = store.get('content_pack');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    if (!data) {
      return {
        exists: false,
        age: 0,
        ageHours: 0,
        size: 0,
      };
    }

    const age = Date.now() - data.timestamp;
    const packString = JSON.stringify(pack);
    const size = new Blob([packString]).size;

    return {
      exists: true,
      age,
      ageHours: age / (1000 * 60 * 60),
      size,
    };
  } catch (error) {
    console.warn('[IndexedDB] Error obteniendo info del cache:', error);
    return {
      exists: false,
      age: 0,
      ageHours: 0,
      size: 0,
    };
  }
}

