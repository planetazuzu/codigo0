# Scripts del Proyecto

## Scripts Disponibles

### Scripts de Verificación

#### `verificar-manual.ts`

Script de verificación completa del Manual TES Digital.

**Uso:**
```bash
npm run verify:manual
```

**Qué verifica:**

1. **Archivos .md accesibles**
   - Verifica que todos los 93 archivos .md existan en `public/manual/`
   - Verifica que los archivos se puedan leer
   - Detecta archivos vacíos

2. **Rutas**
   - Verifica el formato de las rutas URL
   - Verifica que el código del capítulo coincida con la ruta
   - Valida estructura de rutas

3. **Navegación**
   - Verifica que los capítulos anterior/siguiente existan
   - Verifica consistencia bidireccional de navegación
   - Detecta referencias rotas

4. **Búsqueda**
   - Prueba búsquedas con términos comunes
   - Verifica que los capítulos sean encontrables por:
     - Título
     - Palabras clave
     - ID

**Código de salida:**
- `0` - Todas las verificaciones pasaron
- `1` - Se encontraron problemas

#### `verify-build.js`

Script de verificación post-build que verifica que el build no contiene `vendor-other` y que todos los chunks están correctamente generados.

**Uso:**
```bash
npm run verify:build
# o automáticamente después de: npm run build
```

#### `diagnose-react.js`

Script de diagnóstico para verificar problemas de React duplicado.

**Uso:**
```bash
node scripts/diagnose-react.js
```

### Scripts de Build y Desarrollo

#### `build.sh`

Wrapper simple para ejecutar el build de producción.

**Uso:**
```bash
./scripts/build.sh
```

#### `dev.sh`

Wrapper simple para ejecutar el entorno de desarrollo.

**Uso:**
```bash
./scripts/dev.sh
```

### Scripts de Deploy

#### `deploy.sh`

Script principal de deploy para producción usando PM2.

**Uso:**
```bash
./scripts/deploy.sh [--skip-git]
```

#### `docker.sh`

Script de deploy con Docker.

**Uso:**
```bash
./scripts/docker.sh [--rebuild] [--stop] [--logs] [--skip-git]
```

#### `push-produccion.sh`

Script para configurar SSH y hacer push a producción.

**Uso:**
```bash
export DEPLOY_PASSWORD='tu_password'
./scripts/push-produccion.sh
```

#### `configurar-remoto-production.sh`

Script para configurar el remoto git de producción.

**Uso:**
```bash
./scripts/configurar-remoto-production.sh TU_IP
```

#### `configurar-ssh-push.sh`

Script para configurar SSH y hacer push a producción.

**Uso:**
```bash
./scripts/configurar-ssh-push.sh
```

### Scripts de Utilidad

#### `cleanup.sh`

Script consolidado de limpieza y optimización del proyecto.

**Uso:**
```bash
./scripts/cleanup.sh
```

#### `limpiar-y-rebuild.sh`

Script para limpiar dependencias y hacer rebuild completo. Soluciona problemas de React duplicado.

**Uso:**
```bash
./scripts/limpiar-y-rebuild.sh
```

#### `copiar-consolidado-a-public.sh`

Script para copiar archivos `SECCION_*.md` desde `docs/consolidado/` a `public/docs/consolidado/`.

**Uso:**
```bash
./scripts/copiar-consolidado-a-public.sh
```

### Scripts de SCORM

#### `generate-scorm.ts`

Script para generar paquetes SCORM.

**Uso:**
```bash
npm run scorm:generate
```

### Scripts de Deploy (subdirectorio)

Ver `scripts/deploy/README_DEPLOY.md` para documentación sobre scripts de deploy avanzados.
