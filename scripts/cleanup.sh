#!/bin/bash
# cleanup.sh
# Script consolidado de limpieza y optimización de EMERGES TES
# Consolidado de cleanup_completo.sh y cleanup_project.sh

set -e  # Detenerse en errores

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🧹 LIMPIEZA Y OPTIMIZACIÓN DEL PROYECTO${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

# 1. Archivos del sistema
echo -e "${YELLOW}[1/6] Limpiando archivos del sistema...${NC}"
find . -type f \( -name ".DS_Store" -o -name "Thumbs.db" -o -name ".localized" -o -name "*.swp" -o -name "*.swo" \) -delete 2>/dev/null || true
echo -e "${GREEN}✅ Archivos del sistema eliminados${NC}"
echo ""

# 2. Logs
echo -e "${YELLOW}[2/6] Eliminando logs...${NC}"
find . -type f \( -name "*.log" -o -name "npm-debug.log*" -o -name "yarn-debug.log*" -o -name "yarn-error.log*" \) -delete 2>/dev/null || true
echo -e "${GREEN}✅ Logs eliminados${NC}"
echo ""

# 3. Limpiar builds anteriores
echo -e "${YELLOW}[3/6] Limpiando builds anteriores...${NC}"
rm -rf dist/ build/ .next/ out/ .cache/ 2>/dev/null || true
echo -e "${GREEN}✅ Builds anteriores eliminados${NC}"
echo ""

# 4. Limpiar Python cache
echo -e "${YELLOW}[4/6] Limpiando Python cache...${NC}"
find . -type d -name "__pycache__" -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -not -path "./node_modules/*" -delete 2>/dev/null || true
echo -e "${GREEN}✅ Python cache limpiado${NC}"
echo ""

# 5. Limpiar archivos temporales
echo -e "${YELLOW}[5/6] Eliminando archivos temporales...${NC}"
find . -name "*.tmp" -o -name "*.temp" 2>/dev/null | grep -v node_modules | grep -v .git | xargs rm -f 2>/dev/null || true
echo -e "${GREEN}✅ Archivos temporales eliminados${NC}"
echo ""

# 6. Eliminar carpetas vacías
echo -e "${YELLOW}[6/6] Eliminando carpetas vacías...${NC}"
find . -type d -empty -not -path "./.git/*" -not -path "./node_modules/*" -delete 2>/dev/null || true
echo -e "${GREEN}✅ Carpetas vacías eliminadas${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ LIMPIEZA COMPLETADA${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos recomendados:${NC}"
echo -e "  1. ${CYAN}npm install${NC}      # Reinstalar dependencias si es necesario"
echo -e "  2. ${CYAN}npm run build${NC}    # Verificar build"
echo -e "  3. ${CYAN}npm run dev${NC}      # Verificar desarrollo"
echo ""

