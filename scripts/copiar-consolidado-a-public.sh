#!/bin/bash

# Script para copiar archivos SECCION_*.md desde docs/consolidado/ a public/docs/consolidado/
# Esto elimina la necesidad de mantener duplicados manualmente

set -e

SOURCE_DIR="docs/consolidado"
TARGET_DIR="public/docs/consolidado"

# Crear directorio destino si no existe
mkdir -p "$TARGET_DIR"

# Copiar solo archivos SECCION_*.md (no archivos técnicos)
echo "📋 Copiando archivos SECCION_*.md desde $SOURCE_DIR a $TARGET_DIR..."
find "$SOURCE_DIR" -name "SECCION_*.md" -type f -exec cp {} "$TARGET_DIR/" \;

# Contar archivos copiados
COUNT=$(find "$TARGET_DIR" -name "SECCION_*.md" -type f | wc -l)
echo "✅ Copiados $COUNT archivos SECCION_*.md"

# Mantener README.md si existe
if [ -f "$TARGET_DIR/README.md" ]; then
  echo "✅ README.md mantenido"
fi

