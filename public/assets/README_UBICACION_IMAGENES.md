# 📁 UBICACIÓN DE IMÁGENES - ESTRUCTURA ACTUALIZADA

## Estructura de Assets (Post-Reorganización)
public/assets/
├── svg/ # Archivos vectoriales
│ ├── ilustraciones/ # Ilustraciones generales
│ ├── tablas/ # Tablas en formato vectorial
│ ├── diagramas/ # Diagramas de flujo/proceso
│ └── logos/ # Logotipos e iconos de marca
├── img/ # Imágenes raster (PNG, JPG)
│ ├── tablas/ # Tablas en formato imagen
│ ├── tecnicas/ # Técnicas y procedimientos
│ ├── equipos/ # Equipamiento médico
│ ├── graficos/ # Gráficos y visualizaciones
│ ├── contenido/ # Contenido general
│ └── react_galeria/ # Imágenes usadas en React
├── backup_svg_originales/ # Backup de SVG originales
└── backup_png_originales/ # Backup de PNG originales

text

## Archivos SVG Principales

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| `situaciones_requieren_inmovilizacion.svg` | `svg/ilustraciones/` | Situaciones que requieren inmovilización |
| `tabla_rangos_fio2.svg` | `svg/tablas/` | Tabla de rangos FiO2 |
| `tecnica_sujecion_manual.svg` | `svg/ilustraciones/` | Técnica de sujeción manual |
| `verificaciones_post_colocacion.svg` | `svg/diagramas/` | Verificaciones post-colocación |
| `START.svg` | `svg/logos/` | Logo START |
| `TES.svg` | `svg/logos/` | Logo TES |

## Archivos PNG Principales

### Tablas
- `tabla_dosis_pediatricas.png` → `img/tablas/`
- `tabla_escala_glasgow.png` → `img/tablas/`
- `tabla_rangos_normales_constantes_vitales.png` → `img/tablas/`

### Técnicas
- `tecnica_sujecion_manual_cervical.png` → `img/tecnicas/`
- `tecnica_sujecion_manual_1.png` → `img/tecnicas/`

### Equipos
- `uso_correcto_ambu.png` → `img/equipos/`
- `uso_correcto_pulsioximetro.png` → `img/equipos/`
- `uso_correcto_tensiometro.png` → `img/equipos/`
- `ventilacion_medios_fortuna.png` → `img/equipos/`

## Uso en React

Las imágenes utilizadas en componentes React (como GaleriaImagenes.tsx) están en:
- `img/react_galeria/` para acceso vía URL pública
- Uso: `<img src="/assets/img/react_galeria/nombre.png" />`

## Referenciación

Para referenciar assets en:
- **Markdown**: `![descripción](/assets/img/tablas/tabla.png)`
- **React**: `<img src="/assets/img/tecnicas/tecnica.png" alt="descripción" />`
- **JSON**: Usar rutas relativas a public/

## Mantenimiento

1. Los backups originales se mantienen en sus respectivos directorios
2. Nueva estructura facilita la escalabilidad
3. Convención de nombres: snake_case para consistencia
