#!/bin/bash

# Claude para Coaches — Instalador
# Laboratorio de Paz · Alejandro Candela
#
# Una línea para empezar:
# curl -sL https://raw.githubusercontent.com/laboratoriodepaz/claude-para-coaches/main/install.sh | bash

set -e

REPO="https://raw.githubusercontent.com/laboratoriodepaz/claude-para-coaches/main"

VERDE='\033[0;32m'
DORADO='\033[0;33m'
GRIS='\033[0;90m'
NEGRITA='\033[1m'
RESET='\033[0m'

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

# Comprobar Node (Claude Code lo trae, así que esto solo falla si Claude Code no está)
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
mkdir -p ~/.claude/commands/paz
mkdir -p ~/.laboratorio-de-paz/so
mkdir -p ~/.laboratorio-de-paz/plantillas
mkdir -p ~/.laboratorio-de-paz/regalos
sleep 1

echo -e "  ${GRIS}Descargando los módulos del curso...${RESET}"
curl -sf "$REPO/commands/paz/start.md" -o ~/.claude/commands/paz/start.md
curl -sf "$REPO/commands/paz/esencia.md" -o ~/.claude/commands/paz/esencia.md
curl -sf "$REPO/commands/paz/skill.md" -o ~/.claude/commands/paz/skill.md
curl -sf "$REPO/commands/paz/agente.md" -o ~/.claude/commands/paz/agente.md
curl -sf "$REPO/commands/paz/encender.md" -o ~/.claude/commands/paz/encender.md
sleep 1

echo -e "  ${GRIS}Descargando los archivos del SO...${RESET}"
curl -sf "$REPO/so/servidor.js" -o ~/.laboratorio-de-paz/so/servidor.js
curl -sf "$REPO/so/index.html" -o ~/.laboratorio-de-paz/so/index.html
curl -sf "$REPO/so/app.js" -o ~/.laboratorio-de-paz/so/app.js
curl -sf "$REPO/so/estilos.css" -o ~/.laboratorio-de-paz/so/estilos.css
curl -sf "$REPO/so/package.json" -o ~/.laboratorio-de-paz/so/package.json

echo -e "  ${GRIS}Descargando las plantillas base...${RESET}"
curl -sf "$REPO/plantillas/claude-md-base.md" -o ~/.laboratorio-de-paz/plantillas/claude-md-base.md
curl -sf "$REPO/plantillas/skill-reel-en-mi-voz.md" -o ~/.laboratorio-de-paz/plantillas/skill-reel-en-mi-voz.md
curl -sf "$REPO/plantillas/agente-contenido.md" -o ~/.laboratorio-de-paz/plantillas/agente-contenido.md

echo -e "  ${GRIS}Descargando los regalos del curso...${RESET}"
curl -sf "$REPO/regalos/30-prompts-anti-guru.md" -o ~/.laboratorio-de-paz/regalos/30-prompts-anti-guru.md
curl -sf "$REPO/regalos/5-workflows-de-coach.md" -o ~/.laboratorio-de-paz/regalos/5-workflows-de-coach.md
curl -sf "$REPO/regalos/plantillas-de-negocio.md" -o ~/.laboratorio-de-paz/regalos/plantillas-de-negocio.md
sleep 1

INSTALADOS=$(ls ~/.claude/commands/paz/*.md 2>/dev/null | wc -l | tr -d ' ')

echo ""

if [ "$INSTALADOS" -ge 5 ]; then
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo -e "  ${VERDE}${NEGRITA}✓ Instalado${RESET}"
  echo ""
  echo "  5 módulos en su sitio"
  echo "  3 plantillas listas"
  echo "  3 regalos esperando"
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo -e "  ${NEGRITA}Ahora:${RESET}"
  echo ""
  echo "  1. Abre Claude Code"
  echo -e "  2. Escribe ${DORADO}${NEGRITA}/paz:start${RESET} y dale a enter"
  echo ""
  echo "  Yo te llevo desde ahí."
  echo ""
  echo -e "  ${GRIS}— A.${RESET}"
  echo ""
else
  echo -e "  ${NEGRITA}Algo no ha cuadrado.${RESET}"
  echo ""
  echo "  Solo se han instalado $INSTALADOS módulos de 5."
  echo "  Lo más probable: tu conexión se cayó un segundo."
  echo ""
  echo "  Vuelve a pegar la línea curl. No pasa nada por intentarlo otra vez."
  echo ""
  exit 1
fi
