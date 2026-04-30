#!/bin/bash

# Claude para Coaches — Instalador
# Laboratorio de Paz · Alejandro Candela
#
# Una línea para empezar:
# curl -sL https://raw.githubusercontent.com/labdepaz-ops/claude-para-coaches/main/install.sh | bash

REPO="https://raw.githubusercontent.com/labdepaz-ops/claude-para-coaches/main"

VERDE='\033[0;32m'
DORADO='\033[0;33m'
GRIS='\033[0;90m'
NEGRITA='\033[1m'
RESET='\033[0m'

descargar() {
  local url="$1"
  local destino="$2"
  if curl -sfL "$url" -o "$destino" 2>/dev/null; then
    return 0
  else
    return 1
  fi
}

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "   ██████╗  █████╗ ███████╗"
echo "   ██╔══██╗██╔══██╗╚══███╔╝"
echo "   ██████╔╝███████║  ███╔╝"
echo "   ██╔═══╝ ██╔══██║ ███╔╝"
echo "   ██║     ██║  ██║███████╗"
echo "   ╚═╝     ╚═╝  ╚═╝╚══════╝"
echo ""
echo "   Claude para Coaches"
echo "   Laboratorio de Paz · Alejandro Candela"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
sleep 1

if ! command -v node &> /dev/null; then
  echo -e "  ${NEGRITA}Espera.${RESET}"
  echo ""
  echo "  No encuentro Node en tu máquina."
  echo ""
  echo "  Eso significa que Claude Code no está instalado todavía."
  echo "  Lo necesitas para hacer el curso."
  echo ""
  echo -e "  ${DORADO}1. Ve a https://claude.ai/download${RESET}"
  echo -e "  ${DORADO}2. Instala Claude Code${RESET}"
  echo -e "  ${DORADO}3. Vuelve aquí y pega esta línea otra vez${RESET}"
  echo ""
  echo "  Tranquilo. No has roto nada."
  echo ""
  exit 1
fi

echo -e "  ${GRIS}Preparando el espacio...${RESET}"
mkdir -p ~/.claude/commands
mkdir -p ~/.laboratorio-de-paz/so
mkdir -p ~/.laboratorio-de-paz/plantillas
mkdir -p ~/.laboratorio-de-paz/regalos

# Limpiar instalación vieja si existe (carpeta paz/ con dos puntos)
if [ -d ~/.claude/commands/paz ]; then
  rm -rf ~/.claude/commands/paz
fi

DESCARGADOS=0
ESPERADOS=0

echo -e "  ${GRIS}Descargando los módulos del curso...${RESET}"
for archivo in paz-start.md paz-esencia.md paz-skill.md paz-agente.md paz-encender.md; do
  ESPERADOS=$((ESPERADOS + 1))
  if descargar "$REPO/commands/$archivo" ~/.claude/commands/$archivo; then
    DESCARGADOS=$((DESCARGADOS + 1))
  fi
done

echo -e "  ${GRIS}Descargando los archivos del SO...${RESET}"
for archivo in servidor.js index.html app.js estilos.css package.json; do
  descargar "$REPO/so/$archivo" ~/.laboratorio-de-paz/so/$archivo || true
done

echo -e "  ${GRIS}Descargando las plantillas base...${RESET}"
for archivo in claude-md-base.md skill-reel-en-mi-voz.md agente-contenido.md; do
  descargar "$REPO/plantillas/$archivo" ~/.laboratorio-de-paz/plantillas/$archivo || true
done

echo -e "  ${GRIS}Descargando los regalos del curso...${RESET}"
for archivo in 30-prompts-anti-guru.md 5-workflows-de-coach.md plantillas-de-negocio.md; do
  descargar "$REPO/regalos/$archivo" ~/.laboratorio-de-paz/regalos/$archivo || true
done

sleep 1
echo ""

if [ "$DESCARGADOS" -eq "$ESPERADOS" ]; then
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo -e "  ${VERDE}${NEGRITA}✓ Instalado${RESET}"
  echo ""
  echo "  $DESCARGADOS módulos en su sitio"
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo -e "  ${NEGRITA}Ahora:${RESET}"
  echo ""
  echo "  1. Abre Claude Code"
  echo -e "  2. Escribe ${DORADO}${NEGRITA}/paz-start${RESET} y dale a enter"
  echo ""
  echo "  Yo te llevo desde ahí."
  echo ""
  echo -e "  ${GRIS}— A.${RESET}"
  echo ""
elif [ "$DESCARGADOS" -gt 0 ]; then
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo -e "  ${DORADO}${NEGRITA}Instalación parcial${RESET}"
  echo ""
  echo "  $DESCARGADOS de $ESPERADOS módulos descargados"
  echo ""
  echo -e "  ${GRIS}(Si esto es una prueba del autor, todo en orden."
  echo -e "   Si no, vuelve a intentarlo.)${RESET}"
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo ""
else
  echo -e "  ${NEGRITA}Algo no ha cuadrado.${RESET}"
  echo ""
  echo "  No se descargó ningún módulo."
  echo "  Lo más probable: tu conexión se cayó un segundo."
  echo ""
  echo "  Vuelve a pegar la línea curl. No pasa nada por intentarlo otra vez."
  echo ""
  exit 1
fi
