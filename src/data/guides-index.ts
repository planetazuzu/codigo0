/**
 * Índice de Guías de Refuerzo (Modo Formativo)
 * 
 * Este archivo contiene la estructura de datos para las Guías de Refuerzo.
 * Cada guía tiene exactamente 8 secciones que corresponden a archivos Markdown
 * en /docs/consolidado/
 */

export interface GuideSection {
  numero: number; // 1-8
  titulo: string;
  archivo: string; // Nombre del archivo sin ruta
  ruta: string; // Ruta completa desde raíz: /docs/consolidado/SECCION_XX_XXXX.md
}

export interface Guide {
  id: string; // Slug para URL (ej: "abcde-operativo")
  titulo: string;
  descripcion: string;
  icono: string; // Nombre de icono de lucide-react
  secciones: GuideSection[]; // Siempre 8 secciones
  protocoloOperativo?: {
    titulo: string;
    ruta: string; // Ruta al protocolo operativo relacionado
  };
  scormAvailable?: boolean; // Fase C: Indica si hay versión SCORM disponible
}

export const guidesIndex: Guide[] = [
  {
    id: "abcde-operativo",
    titulo: "ABCDE Operativo",
    descripcion: "Guía de refuerzo para comprender el enfoque ABCDE como estructura mental de priorización aplicable a todas las emergencias prehospitalarias",
    icono: "Activity",
    scormAvailable: true, // Fase C: Versión SCORM disponible
    secciones: [
      {
        numero: 1,
        titulo: "Introducción y Contexto",
        archivo: "SECCION_01_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_01_ABCDE_OPERATIVO.md"
      },
      {
        numero: 2,
        titulo: "Explicación Clínica y Fisiopatología",
        archivo: "SECCION_02_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_02_ABCDE_OPERATIVO.md"
      },
      {
        numero: 3,
        titulo: "Algoritmo Comentado Visual",
        archivo: "SECCION_03_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_03_ABCDE_OPERATIVO.md"
      },
      {
        numero: 4,
        titulo: "Medios Visuales y Demostración",
        archivo: "SECCION_04_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_04_ABCDE_OPERATIVO.md"
      },
      {
        numero: 5,
        titulo: "Errores Frecuentes Visualizados",
        archivo: "SECCION_05_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_05_ABCDE_OPERATIVO.md"
      },
      {
        numero: 6,
        titulo: "Casos Clínicos",
        archivo: "SECCION_06_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_06_ABCDE_OPERATIVO.md"
      },
      {
        numero: 7,
        titulo: "Simulación Mental Guiada",
        archivo: "SECCION_07_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_07_ABCDE_OPERATIVO.md"
      },
      {
        numero: 8,
        titulo: "Resumen Visual y Puente al Operativo",
        archivo: "SECCION_08_ABCDE_OPERATIVO.md",
        ruta: "/docs/consolidado/SECCION_08_ABCDE_OPERATIVO.md"
      }
    ],
    protocoloOperativo: {
      titulo: "ABCDE Operativo",
      ruta: "/manual/parte-i-fundamentos/bloque-1-procedimientos-basicos/1.2.2"
    }
  },
  {
    id: "rcp-adulto-svb",
    titulo: "RCP Adulto SVB",
    descripcion: "Guía de refuerzo para comprender en profundidad la Reanimación Cardiopulmonar Básica en adultos, su fisiopatología y aplicación correcta",
    icono: "Heart",
    scormAvailable: true, // Fase C: Versión SCORM disponible
    secciones: [
      {
        numero: 1,
        titulo: "Introducción y Contexto",
        archivo: "SECCION_01_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_01_RCP_ADULTO_SVB.md"
      },
      {
        numero: 2,
        titulo: "Explicación Clínica y Fisiopatología",
        archivo: "SECCION_02_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_02_RCP_ADULTO_SVB.md"
      },
      {
        numero: 3,
        titulo: "Algoritmo Comentado Visual",
        archivo: "SECCION_03_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_03_RCP_ADULTO_SVB.md"
      },
      {
        numero: 4,
        titulo: "Medios Visuales y Demostración",
        archivo: "SECCION_04_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_04_RCP_ADULTO_SVB.md"
      },
      {
        numero: 5,
        titulo: "Errores Frecuentes Visualizados",
        archivo: "SECCION_05_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_05_RCP_ADULTO_SVB.md"
      },
      {
        numero: 6,
        titulo: "Casos Clínicos",
        archivo: "SECCION_06_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_06_RCP_ADULTO_SVB.md"
      },
      {
        numero: 7,
        titulo: "Simulación Mental Guiada",
        archivo: "SECCION_07_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_07_RCP_ADULTO_SVB.md"
      },
      {
        numero: 8,
        titulo: "Resumen Visual y Puente al Operativo",
        archivo: "SECCION_08_RCP_ADULTO_SVB.md",
        ruta: "/docs/consolidado/SECCION_08_RCP_ADULTO_SVB.md"
      }
    ],
    protocoloOperativo: {
      titulo: "RCP Adulto SVB",
      ruta: "/rcp"
    }
  },
  {
    id: "desa-adulto",
    titulo: "DESA Adulto",
    descripcion: "Guía de refuerzo para comprender en profundidad el uso del Desfibrilador Externo Semiautomático (DESA) en adultos",
    icono: "Zap",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_01_DESA_ADULTO.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_02_DESA_ADULTO.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_03_DESA_ADULTO.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_04_DESA_ADULTO.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_05_DESA_ADULTO.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_06_DESA_ADULTO.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_07_DESA_ADULTO.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_DESA_ADULTO.md", ruta: "/docs/consolidado/SECCION_08_DESA_ADULTO.md" }
    ]
  },
  {
    id: "ovace-adulto",
    titulo: "OVACE Adulto",
    descripcion: "Guía de refuerzo para comprender en profundidad la Obstrucción de la Vía Aérea por Cuerpo Extraño (OVACE) en adultos",
    icono: "Wind",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_01_OVACE_ADULTO.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_02_OVACE_ADULTO.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_03_OVACE_ADULTO.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_04_OVACE_ADULTO.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_05_OVACE_ADULTO.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_06_OVACE_ADULTO.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_07_OVACE_ADULTO.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_OVACE_ADULTO.md", ruta: "/docs/consolidado/SECCION_08_OVACE_ADULTO.md" }
    ],
    protocoloOperativo: {
      titulo: "OVACE Adulto",
      ruta: "/via-aerea"
    }
  },
  {
    id: "ovace-pediatrica",
    titulo: "OVACE Pediátrica",
    descripcion: "Guía de refuerzo para comprender en profundidad la Obstrucción de la Vía Aérea por Cuerpo Extraño (OVACE) en población pediátrica",
    icono: "Wind",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_01_OVACE_PEDIATRICA.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_02_OVACE_PEDIATRICA.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_03_OVACE_PEDIATRICA.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_04_OVACE_PEDIATRICA.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_05_OVACE_PEDIATRICA.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_06_OVACE_PEDIATRICA.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_07_OVACE_PEDIATRICA.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_OVACE_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_08_OVACE_PEDIATRICA.md" }
    ]
  },
  {
    id: "parada-respiratoria",
    titulo: "Parada Respiratoria",
    descripcion: "Guía de refuerzo para comprender en profundidad la parada respiratoria, su fisiopatología y manejo correcto",
    icono: "Activity",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_01_PARADA_RESPIRATORIA.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_02_PARADA_RESPIRATORIA.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_03_PARADA_RESPIRATORIA.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_04_PARADA_RESPIRATORIA.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_05_PARADA_RESPIRATORIA.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_06_PARADA_RESPIRATORIA.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_07_PARADA_RESPIRATORIA.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_PARADA_RESPIRATORIA.md", ruta: "/docs/consolidado/SECCION_08_PARADA_RESPIRATORIA.md" }
    ]
  },
  {
    id: "pcr-traumatica",
    titulo: "PCR Traumática",
    descripcion: "Guía de refuerzo para comprender en profundidad la Parada Cardiorrespiratoria de origen traumático y su manejo específico",
    icono: "AlertTriangle",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_01_PCR_TRAUMATICA.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_02_PCR_TRAUMATICA.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_03_PCR_TRAUMATICA.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_04_PCR_TRAUMATICA.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_05_PCR_TRAUMATICA.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_06_PCR_TRAUMATICA.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_07_PCR_TRAUMATICA.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_PCR_TRAUMATICA.md", ruta: "/docs/consolidado/SECCION_08_PCR_TRAUMATICA.md" }
    ]
  },
  {
    id: "rcp-lactantes",
    titulo: "RCP Lactantes",
    descripcion: "Guía de refuerzo para comprender en profundidad la Reanimación Cardiopulmonar en lactantes, sus particularidades y técnica correcta",
    icono: "Heart",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_01_RCP_LACTANTES.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_02_RCP_LACTANTES.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_03_RCP_LACTANTES.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_04_RCP_LACTANTES.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_05_RCP_LACTANTES.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_06_RCP_LACTANTES.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_07_RCP_LACTANTES.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_RCP_LACTANTES.md", ruta: "/docs/consolidado/SECCION_08_RCP_LACTANTES.md" }
    ]
  },
  {
    id: "rcp-pediatrica",
    titulo: "RCP Pediátrica",
    descripcion: "Guía de refuerzo para comprender en profundidad la Reanimación Cardiopulmonar en población pediátrica, su fisiopatología y aplicación correcta",
    icono: "Heart",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_01_RCP_PEDIATRICA.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_02_RCP_PEDIATRICA.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_03_RCP_PEDIATRICA.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_04_RCP_PEDIATRICA.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_05_RCP_PEDIATRICA.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_06_RCP_PEDIATRICA.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_07_RCP_PEDIATRICA.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_RCP_PEDIATRICA.md", ruta: "/docs/consolidado/SECCION_08_RCP_PEDIATRICA.md" }
    ],
    protocoloOperativo: {
      titulo: "RCP Pediátrica",
      ruta: "/rcp"
    }
  },
  {
    id: "reconocimiento-pcr",
    titulo: "Reconocimiento PCR",
    descripcion: "Guía de refuerzo para comprender en profundidad el reconocimiento de la Parada Cardiorrespiratoria, sus signos y evaluación inicial",
    icono: "Search",
    scormAvailable: true,
    secciones: [
      { numero: 1, titulo: "Introducción y Contexto", archivo: "SECCION_01_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_01_RECONOCIMIENTO_PCR.md" },
      { numero: 2, titulo: "Explicación Clínica y Fisiopatología", archivo: "SECCION_02_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_02_RECONOCIMIENTO_PCR.md" },
      { numero: 3, titulo: "Algoritmo Comentado Visual", archivo: "SECCION_03_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_03_RECONOCIMIENTO_PCR.md" },
      { numero: 4, titulo: "Medios Visuales y Demostración", archivo: "SECCION_04_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_04_RECONOCIMIENTO_PCR.md" },
      { numero: 5, titulo: "Errores Frecuentes Visualizados", archivo: "SECCION_05_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_05_RECONOCIMIENTO_PCR.md" },
      { numero: 6, titulo: "Casos Clínicos", archivo: "SECCION_06_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_06_RECONOCIMIENTO_PCR.md" },
      { numero: 7, titulo: "Simulación Mental Guiada", archivo: "SECCION_07_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_07_RECONOCIMIENTO_PCR.md" },
      { numero: 8, titulo: "Resumen Visual y Puente al Operativo", archivo: "SECCION_08_RECONOCIMIENTO_PCR.md", ruta: "/docs/consolidado/SECCION_08_RECONOCIMIENTO_PCR.md" }
    ]
  }
];

/**
 * Obtiene una guía por su ID
 */
export function getGuideById(id: string): Guide | undefined {
  return guidesIndex.find(g => g.id === id);
}

/**
 * Obtiene una sección específica de una guía
 */
export function getGuideSection(guideId: string, numero: number): GuideSection | undefined {
  const guide = getGuideById(guideId);
  return guide?.secciones.find(s => s.numero === numero);
}

/**
 * Obtiene todas las guías disponibles
 */
export function getAllGuides(): Guide[] {
  return guidesIndex;
}

