/**
 * Registry de imágenes para el sistema de medios visuales
 * 
 * Permite usar alias cortos en Markdown en lugar de rutas completas:
 * ![collarin-seleccion] en lugar de ![Descripción]/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_cervical.png)
 * 
 * Ventajas:
 * - Referencias más cortas y legibles
 * - Metadatos centralizados (alt, caption, tags)
 * - Validación centralizada
 * - Fácil mantenimiento (cambiar ruta en un solo lugar)
 */

export interface ImageMetadata {
  /** ID único del alias (usado en Markdown) */
  id: string;
  /** Ruta completa a la imagen */
  path: string;
  /** Texto alternativo para accesibilidad */
  alt: string;
  /** Caption opcional que se muestra debajo de la imagen */
  caption?: string;
  /** Bloque temático al que pertenece */
  block: string;
  /** Capítulo relacionado (opcional) */
  chapter?: string;
  /** Tags para búsqueda y filtrado */
  tags?: string[];
}

/**
 * Registry completo de imágenes
 * 
 * Organizado por bloques temáticos para fácil mantenimiento
 */
export const imageRegistry: Record<string, ImageMetadata> = {
  // ============================================
  // BLOQUE 0: FUNDAMENTOS
  // ============================================
  'abcde-algoritmo': {
    id: 'abcde-algoritmo',
    path: '/assets/infografias/bloque-0-fundamentos/algoritmo_operativo_del_tes.svg',
    alt: 'Algoritmo operativo del TES - Evaluación ABCDE',
    caption: 'Diagrama de flujo del algoritmo ABCDE operativo para TES',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'evaluacion', 'algoritmo', 'fundamentos']
  },
  'abcde-introduccion-estructura-mental': {
    id: 'abcde-introduccion-estructura-mental',
    path: '/assets/infografias/bloque-0-fundamentos/abcde_introduccion_estructura_mental.svg',
    alt: 'ABCDE como estructura mental de priorización - Infografía conceptual',
    caption: 'Infografía que muestra el ABCDE como estructura mental de priorización, comparando evaluación desordenada vs estructurada',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'introduccion', 'estructura-mental', 'priorizacion', 'formacion']
  },
  'triage-start': {
    id: 'triage-start',
    path: '/assets/infografias/bloque-0-fundamentos/resumen_visual_del_algoritmo_start.svg',
    alt: 'Resumen visual del algoritmo START de triage',
    caption: 'Algoritmo START para clasificación rápida de víctimas',
    block: 'bloque-0-fundamentos',
    tags: ['triage', 'start', 'clasificacion', 'masivo']
  },
  'diagrama-seleccion-oxigenoterapia': {
    id: 'diagrama-seleccion-oxigenoterapia',
    path: '/assets/infografias/bloque-0-fundamentos/diagrama_seleccion_dispositivo_oxigenoterapia.png',
    alt: 'Diagrama de selección de dispositivo de oxigenoterapia',
    caption: 'Guía visual para seleccionar el dispositivo de oxigenoterapia adecuado',
    block: 'bloque-0-fundamentos',
    tags: ['oxigenoterapia', 'dispositivos', 'seleccion']
  },
  'tabla-rangos-fio2': {
    id: 'tabla-rangos-fio2',
    path: '/assets/infografias/bloque-0-fundamentos/tabla_rangos_fio2_oxigenoterapia.png',
    alt: 'Tabla de rangos de FiO2 por dispositivo de oxigenoterapia',
    caption: 'Rangos de fracción inspiratoria de oxígeno (FiO2) según dispositivo',
    block: 'bloque-0-fundamentos',
    tags: ['oxigenoterapia', 'fio2', 'tabla', 'rangos']
  },
  'flujo-rcp-transtelefonica': {
    id: 'flujo-rcp-transtelefonica',
    path: '/assets/infografias/bloque-0-fundamentos/flujo_rcp_transtelefonica.png',
    alt: 'Flujo de RCP transtelefónica',
    caption: 'Diagrama de flujo para RCP asistida por teléfono',
    block: 'bloque-0-fundamentos',
    tags: ['rcp', 'transtelefonica', 'flujo']
  },
  'flujo-desa-telefono': {
    id: 'flujo-desa-telefono',
    path: '/assets/infografias/bloque-0-fundamentos/flujo_desa_telefono.png',
    alt: 'Flujo de uso de DESA transtelefónico',
    caption: 'Diagrama de flujo para uso de DESA con asistencia telefónica',
    block: 'bloque-0-fundamentos',
    tags: ['desa', 'transtelefonica', 'flujo', 'desfibrilacion']
  },
  'abcde-piramide-prioridad-vital': {
    id: 'abcde-piramide-prioridad-vital',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_PIRAMIDE_PRIORIDAD_VITAL.png',
    alt: 'Pirámide de Prioridad Vital ABCDE - Jerarquía fisiológica',
    caption: 'Diagrama que muestra la jerarquía de prioridad vital del ABCDE como pirámide vertical',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'piramide', 'prioridad', 'jerarquia', 'fisiopatologia', 'formacion']
  },
  'abcde-comparacion-desorden-estructura': {
    id: 'abcde-comparacion-desorden-estructura',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_COMPARACION_DESORDEN_VS_ESTRUCTURA.png',
    alt: 'Comparación: Evaluación Desordenada vs Estructurada ABCDE',
    caption: 'Diagrama comparativo que muestra cómo el ABCDE evita la fijación en problemas visibles pero secundarios',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'comparacion', 'desorden', 'estructura', 'fijacion', 'formacion']
  },
  'abcde-flujo-deterioro-fisiologico': {
    id: 'abcde-flujo-deterioro-fisiologico',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_FLUJO_DETERIORO_FISIOLOGICO.png',
    alt: 'Flujo de Deterioro Fisiológico ABCDE',
    caption: 'Diagrama que explica cómo un fallo no resuelto en niveles superiores conduce al colapso de los inferiores',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'flujo', 'deterioro', 'fisiologico', 'colapso', 'formacion']
  },
  'abcde-algoritmo-completo': {
    id: 'abcde-algoritmo-completo',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_ALGORITMO_COMPLETO.png',
    alt: 'Infografía: Algoritmo ABCDE Completo',
    caption: 'Infografía conceptual del algoritmo ABCDE completo mostrando estructura vertical, flujo descendente y control antes de avanzar',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'algoritmo', 'completo', 'infografia', 'formacion']
  },
  'abcde-imagen-01-escaneo-inicial': {
    id: 'abcde-imagen-01-escaneo-inicial',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_IMAGEN_01_ESCANEO_INICIAL.jpg',
    alt: 'ABCDE - Escaneo Inicial',
    caption: 'Fotografía conceptual mostrando visión global inicial del proceso ABCDE',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'fotografia', 'escaneo', 'inicial', 'formacion']
  },
  'abcde-imagen-02-prioridad-vital': {
    id: 'abcde-imagen-02-prioridad-vital',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_IMAGEN_02_PRIORIDAD_VITAL.jpg',
    alt: 'ABCDE - Prioridad Vital',
    caption: 'Fotografía conceptual mostrando enfoque en prioridad vital (nivel A)',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'fotografia', 'prioridad', 'vital', 'formacion']
  },
  'abcde-imagen-03-transicion-controlado': {
    id: 'abcde-imagen-03-transicion-controlado',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_IMAGEN_03_TRANSICION_CONTROLADO.jpg',
    alt: 'ABCDE - Transición Controlado',
    caption: 'Fotografía conceptual mostrando transición entre niveles cuando está controlado',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'fotografia', 'transicion', 'controlado', 'formacion']
  },
  'abcde-imagen-04-reevaluacion-ciclo': {
    id: 'abcde-imagen-04-reevaluacion-ciclo',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_IMAGEN_04_REEVALUACION_CICLO.jpg',
    alt: 'ABCDE - Reevaluación Ciclo',
    caption: 'Fotografía conceptual mostrando reevaluación constante del ciclo ABCDE',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'fotografia', 'reevaluacion', 'ciclo', 'formacion']
  },
  'abcde-imagen-05-vision-global': {
    id: 'abcde-imagen-05-vision-global',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_IMAGEN_05_VISION_GLOBAL.jpg',
    alt: 'ABCDE - Visión Global',
    caption: 'Fotografía conceptual mostrando evaluación global integradora',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'fotografia', 'vision', 'global', 'formacion']
  },
  'abcde-error-01-saltarse-letras': {
    id: 'abcde-error-01-saltarse-letras',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_ERROR_01_SALTARSE_LETRAS.png',
    alt: 'Error 1: Saltarse Letras del ABCDE',
    caption: 'Diagrama comparativo mostrando el error de saltarse letras del ABCDE',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'error', 'saltarse', 'letras', 'formacion']
  },
  'abcde-error-02-atascarse-letra': {
    id: 'abcde-error-02-atascarse-letra',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_ERROR_02_ATASCARSE_LETRA.png',
    alt: 'Error 2: Quedarse Atascado en una Letra',
    caption: 'Diagrama comparativo mostrando el error de quedarse atascado en una letra',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'error', 'atascarse', 'letra', 'formacion']
  },
  'abcde-error-03-visible-sobre-vital': {
    id: 'abcde-error-03-visible-sobre-vital',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_ERROR_03_VISIBLE_SOBRE_VITAL.png',
    alt: 'Error 3: Priorizar lo Visible sobre lo Vital',
    caption: 'Diagrama comparativo mostrando el error de priorizar lo visible sobre lo vital',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'error', 'visible', 'vital', 'formacion']
  },
  'abcde-error-04-no-reevaluar': {
    id: 'abcde-error-04-no-reevaluar',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_ERROR_04_NO_REEVALUAR.png',
    alt: 'Error 4: No Reevaluar lo Ya Valorado',
    caption: 'Diagrama comparativo mostrando el error de no reevaluar lo ya valorado',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'error', 'reevaluar', 'formacion']
  },
  'abcde-error-05-perder-vision-global': {
    id: 'abcde-error-05-perder-vision-global',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_ERROR_05_PERDER_VISION_GLOBAL.png',
    alt: 'Error 5: Perder la Visión Global del Paciente',
    caption: 'Diagrama comparativo mostrando el error de perder la visión global del paciente',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'error', 'vision', 'global', 'formacion']
  },
  'abcde-sintesis-estructura-proteccion': {
    id: 'abcde-sintesis-estructura-proteccion',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_SINTESIS_ESTRUCTURA_PROTECCION.png',
    alt: 'Síntesis: ABCDE como Estructura Completa y Protección',
    caption: 'Infografía de síntesis mostrando ABCDE como estructura completa con errores frecuentes marcados',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'sintesis', 'estructura', 'proteccion', 'formacion']
  },
  'abcde-resumen-flujo-mental-continuo': {
    id: 'abcde-resumen-flujo-mental-continuo',
    path: '/assets/infografias/bloque-0-fundamentos/ABCDE_RESUMEN_FLUJO_MENTAL_CONTINUO.png',
    alt: 'Resumen Visual: ABCDE como Flujo Mental Continuo',
    caption: 'Infografía de resumen mostrando ABCDE como flujo mental continuo con ciclo de reevaluación',
    block: 'bloque-0-fundamentos',
    tags: ['abcde', 'resumen', 'flujo', 'mental', 'continuo', 'formacion']
  },

  // ============================================
  // BLOQUE 1: PROCEDIMIENTOS BÁSICOS
  // ============================================
  'registro-constantes-vitales': {
    id: 'registro-constantes-vitales',
    path: '/assets/infografias/bloque-3-material-sanitario/registro_constantes_vitales.png',
    alt: 'Registro de constantes vitales',
    caption: 'Formato de registro de constantes vitales',
    block: 'bloque-1-procedimientos',
    tags: ['constantes', 'registro', 'monitorizacion']
  },
  'interpretacion-constantes-semaforo': {
    id: 'interpretacion-constantes-semaforo',
    path: '/assets/infografias/bloque-3-material-sanitario/interpretacion_constantes_semaforo.png',
    alt: 'Interpretación de constantes vitales - Sistema semáforo',
    caption: 'Sistema de interpretación rápida de constantes vitales (verde/amarillo/rojo)',
    block: 'bloque-1-procedimientos',
    tags: ['constantes', 'interpretacion', 'semaforo', 'alerta']
  },
  'uso-pulsioximetro': {
    id: 'uso-pulsioximetro',
    path: '/assets/infografias/bloque-3-material-sanitario/uso_correcto_pulsioximetro.png',
    alt: 'Uso correcto del pulsioxímetro',
    caption: 'Guía de colocación y uso correcto del pulsioxímetro',
    block: 'bloque-1-procedimientos',
    tags: ['pulsioximetro', 'spo2', 'oxigenacion', 'monitorizacion']
  },
  'uso-tensiometro': {
    id: 'uso-tensiometro',
    path: '/assets/infografias/bloque-3-material-sanitario/uso_correcto_tensiometro.png',
    alt: 'Uso correcto del tensiómetro',
    caption: 'Guía de colocación y uso correcto del tensiómetro',
    block: 'bloque-1-procedimientos',
    tags: ['tensiometro', 'presion', 'ta', 'monitorizacion']
  },

  // ============================================
  // BLOQUE 2: INMOVILIZACIÓN
  // ============================================
  'collarin-seleccion': {
    id: 'collarin-seleccion',
    path: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_cervical.png',
    alt: 'Selección de talla de collarín cervical',
    caption: 'Guía visual para seleccionar la talla correcta de collarín cervical',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'inmovilizacion', 'seleccion', 'talla']
  },
  'collarin-medicion': {
    id: 'collarin-medicion',
    path: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_medicion_anatomica.png',
    alt: 'Medición anatómica para selección de talla de collarín',
    caption: 'Técnica de medición anatómica para determinar la talla correcta',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'medicion', 'anatomia', 'talla']
  },
  'collarin-tabla-tallas': {
    id: 'collarin-tabla-tallas',
    path: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_tabla_tallas.png',
    alt: 'Tabla de tallas de collarín cervical',
    caption: 'Tabla de referencia para selección de talla según medidas',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'tabla', 'tallas', 'referencia']
  },
  'collarin-paso-1': {
    id: 'collarin-paso-1',
    path: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_1_preparacion.png',
    alt: 'Paso 1: Preparación para colocación de collarín',
    caption: 'Preparación del paciente y material antes de colocar el collarín',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'colocacion', 'paso-1', 'preparacion']
  },
  'collarin-paso-2': {
    id: 'collarin-paso-2',
    path: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_2_parte_posterior.png',
    alt: 'Paso 2: Colocación de la parte posterior del collarín',
    caption: 'Colocación de la parte posterior del collarín cervical',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'colocacion', 'paso-2', 'posterior']
  },
  'collarin-paso-3': {
    id: 'collarin-paso-3',
    path: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_3_parte_anterior.png',
    alt: 'Paso 3: Colocación de la parte anterior del collarín',
    caption: 'Colocación de la parte anterior del collarín cervical',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'colocacion', 'paso-3', 'anterior']
  },
  'collarin-paso-4': {
    id: 'collarin-paso-4',
    path: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_4_ajuste_cierres.png',
    alt: 'Paso 4: Ajuste de cierres del collarín',
    caption: 'Ajuste correcto de los cierres del collarín cervical',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'colocacion', 'paso-4', 'ajuste']
  },
  'collarin-paso-5': {
    id: 'collarin-paso-5',
    path: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_5_verificacion.png',
    alt: 'Paso 5: Verificación de la colocación del collarín',
    caption: 'Verificación de la correcta colocación del collarín cervical',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'colocacion', 'paso-5', 'verificacion']
  },
  'collarin-paso-6': {
    id: 'collarin-paso-6',
    path: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_6_liberacion_controlada.png',
    alt: 'Paso 6: Liberación controlada del control manual',
    caption: 'Liberación controlada del control manual tras verificar el collarín',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'colocacion', 'paso-6', 'liberacion']
  },
  'collarin-verificaciones': {
    id: 'collarin-verificaciones',
    path: '/assets/infografias/bloque-2-inmovilizacion/verificaciones_post_colocacion_collarin.png',
    alt: 'Verificaciones post-colocación del collarín cervical',
    caption: 'Checklist de verificaciones después de colocar el collarín',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'verificaciones', 'checklist', 'post-colocacion']
  },
  'collarin-errores': {
    id: 'collarin-errores',
    path: '/assets/infografias/bloque-2-inmovilizacion/errores_frecuentes_collarin_cervical.png',
    alt: 'Errores frecuentes en la colocación del collarín cervical',
    caption: 'Errores comunes y cómo evitarlos al colocar el collarín',
    block: 'bloque-2-inmovilizacion',
    tags: ['collarin', 'errores', 'prevencion', 'comunes']
  },

  // ============================================
  // BLOQUE 3: MATERIAL SANITARIO Y OXIGENOTERAPIA
  // ============================================
  'canulas-guedel-nasofaringea': {
    id: 'canulas-guedel-nasofaringea',
    path: '/assets/infografias/bloque-3-material-sanitario/canulas_guedel_nasofaringea.png',
    alt: 'Cánulas de Guedel y nasofaríngea',
    caption: 'Tipos de cánulas de vía aérea: orofaríngea (Guedel) y nasofaríngea',
    block: 'bloque-3-material-sanitario',
    tags: ['canulas', 'via-aerea', 'guedel', 'nasofaringea']
  },
  'uso-ambu': {
    id: 'uso-ambu',
    path: '/assets/infografias/bloque-3-material-sanitario/uso_correcto_ambu.png',
    alt: 'Uso correcto de la bolsa-mascarilla (Ambú)',
    caption: 'Técnica correcta de uso de la bolsa-mascarilla para ventilación',
    block: 'bloque-3-material-sanitario',
    tags: ['ambu', 'bvm', 'ventilacion', 'bolsa-mascarilla']
  },
  'configuracion-fio2-bvm': {
    id: 'configuracion-fio2-bvm',
    path: '/assets/infografias/bloque-3-material-sanitario/configuracion_maxima_fio2_bolsa_mascarilla.png',
    alt: 'Configuración máxima de FiO2 con bolsa-mascarilla',
    caption: 'Configuración para obtener máxima FiO2 con bolsa-mascarilla',
    block: 'bloque-3-material-sanitario',
    tags: ['bvm', 'fio2', 'configuracion', 'oxigenoterapia']
  },
  'guia-colocacion-oxigenoterapia': {
    id: 'guia-colocacion-oxigenoterapia',
    path: '/assets/infografias/bloque-0-fundamentos/guia_colocacion_dispositivos_oxigenoterapia.png',
    alt: 'Guía de colocación de dispositivos de oxigenoterapia',
    caption: 'Guía visual para la colocación correcta de dispositivos de oxigenoterapia',
    block: 'bloque-3-material-sanitario',
    tags: ['oxigenoterapia', 'colocacion', 'dispositivos', 'guia']
  },
};

/**
 * Buscar imágenes por bloque temático
 */
export const findImagesByBlock = (block: string): ImageMetadata[] => {
  return Object.values(imageRegistry).filter(img => img.block === block);
};

/**
 * Buscar imágenes por tags
 */
export const findImagesByTags = (tags: string[]): ImageMetadata[] => {
  return Object.values(imageRegistry).filter(img => 
    img.tags && tags.some(tag => img.tags?.includes(tag))
  );
};

/**
 * Buscar imagen por ID (alias)
 */
export const findImageById = (id: string): ImageMetadata | undefined => {
  return imageRegistry[id];
};

/**
 * Verificar si un ID existe en el registry
 */
export const hasImageId = (id: string): boolean => {
  return id in imageRegistry;
};
