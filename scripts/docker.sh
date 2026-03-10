#!/bin/bash

# Script de deploy con Docker para EMERGES TES
# Uso: ./docker.sh [--rebuild] [--stop] [--logs]
# Requisitos: Docker, Docker Compose

set -e  # Salir si hay error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
CONTAINER_NAME="emerges-tes"
IMAGE_NAME="emerges-tes"
PORT=8607
COMPOSE_FILE="docker-compose.yml"

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}🐳 Deploy Docker de EMERGES TES${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Error: Docker no está instalado${NC}"
  exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo -e "${RED}❌ Error: Docker Compose no está instalado${NC}"
  exit 1
fi

# Detectar comando de compose (docker-compose o docker compose)
if command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
else
  COMPOSE_CMD="docker compose"
fi

echo -e "${GREEN}✅ Docker detectado: $(docker --version)${NC}"
echo -e "${GREEN}✅ Docker Compose detectado${NC}"
echo ""

# Procesar argumentos
REBUILD=false
STOP=false
LOGS=false
SKIP_GIT=false

for arg in "$@"; do
  case $arg in
    --rebuild)
      REBUILD=true
      shift
      ;;
    --stop)
      STOP=true
      shift
      ;;
    --logs)
      LOGS=true
      shift
      ;;
    --skip-git)
      SKIP_GIT=true
      shift
      ;;
    *)
      # Argumento desconocido
      ;;
  esac
done

# Si se solicita detener
if [ "$STOP" = true ]; then
  echo -e "${YELLOW}🛑 Deteniendo contenedor...${NC}"
  $COMPOSE_CMD down
  echo -e "${GREEN}✅ Contenedor detenido${NC}"
  exit 0
fi

# Si se solicitan logs
if [ "$LOGS" = true ]; then
  echo -e "${YELLOW}📋 Mostrando logs...${NC}"
  $COMPOSE_CMD logs -f
  exit 0
fi

# 1. Actualizar código desde git (si no se salta)
if [ "$SKIP_GIT" = false ]; then
  echo -e "${YELLOW}📥 [1/4] Actualizando código desde git...${NC}"
  if git pull origin main; then
    echo -e "${GREEN}✅ Código actualizado${NC}"
  else
    echo -e "${RED}⚠️  Error al actualizar desde git (continuando...)\n${NC}"
  fi
else
  echo -e "${YELLOW}⏭️  [1/4] Saltando actualización de git (--skip-git)${NC}"
fi

# 2. Verificar que Dockerfile existe
echo -e "${YELLOW}🔍 [2/4] Verificando Dockerfile...${NC}"
if [ ! -f "Dockerfile" ]; then
  echo -e "${RED}❌ Error: Dockerfile no encontrado${NC}"
  exit 1
fi
if [ ! -f "$COMPOSE_FILE" ]; then
  echo -e "${RED}❌ Error: $COMPOSE_FILE no encontrado${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Archivos Docker encontrados${NC}"

# 3. Construir imagen (si es necesario)
if [ "$REBUILD" = true ]; then
  echo -e "${YELLOW}🔨 [3/4] Reconstruyendo imagen Docker...${NC}"
  $COMPOSE_CMD build --no-cache
  echo -e "${GREEN}✅ Imagen reconstruida${NC}"
else
  echo -e "${YELLOW}🔨 [3/4] Construyendo/actualizando imagen Docker...${NC}"
  $COMPOSE_CMD build
  echo -e "${GREEN}✅ Imagen lista${NC}"
fi

# 4. Iniciar/Reiniciar contenedor
echo -e "${YELLOW}🚀 [4/4] Iniciando contenedor...${NC}"
$COMPOSE_CMD up -d

# Esperar a que el contenedor esté listo
echo -e "${YELLOW}⏳ Esperando a que el contenedor esté listo...${NC}"
sleep 3

# Verificar estado
if docker ps | grep -q "$CONTAINER_NAME"; then
  echo -e "${GREEN}✅ Contenedor iniciado correctamente${NC}"
else
  echo -e "${RED}❌ Error: El contenedor no está corriendo${NC}"
  echo -e "${YELLOW}📋 Últimos logs:${NC}"
  $COMPOSE_CMD logs --tail=50
  exit 1
fi

# Mostrar información
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deploy Docker completado!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📊 Estado del contenedor:${NC}"
docker ps | grep "$CONTAINER_NAME" || true
echo ""
echo -e "${GREEN}🌐 Aplicación disponible en: http://localhost:$PORT${NC}"
echo -e "${GREEN}📝 Logs: $COMPOSE_CMD logs -f${NC}"
echo -e "${GREEN}📊 Estado: docker ps | grep $CONTAINER_NAME${NC}"
echo -e "${GREEN}🛑 Detener: $COMPOSE_CMD down${NC}"
echo ""

