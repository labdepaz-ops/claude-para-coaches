// Sistema Operativo de Paz · Servidor local
// Laboratorio de Paz · Alejandro Candela
//
// Sirve los archivos del SO en localhost:3000 y conecta el chat con la API de Anthropic.
// La API key vive en .env, en local. No sale de la máquina del coach.

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUERTO = 3000;
const CARPETA_PAZ = path.join(os.homedir(), '.laboratorio-de-paz');
const RUTA_CLAUDE_MD = path.join(CARPETA_PAZ, 'CLAUDE.md');
const RUTA_ENV = path.join(__dirname, '.env');
const CARPETA_SKILLS = path.join(os.homedir(), '.claude', 'skills');
const CARPETA_AGENTES = path.join(os.homedir(), '.claude', 'agents');

// ─── Carga de la API key desde .env ──────────────────────────────────────────

async function cargarApiKey() {
  try {
    const contenido = await fs.readFile(RUTA_ENV, 'utf-8');
    const linea = contenido.split('\n').find(l => l.startsWith('ANTHROPIC_API_KEY='));
    if (!linea) return null;
    return linea.split('=')[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    return null;
  }
}

// ─── Mime types ──────────────────────────────────────────────────────────────

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

// ─── Endpoints ───────────────────────────────────────────────────────────────

async function endpointClaudeMd(req, res) {
  try {
    const md = await fs.readFile(RUTA_CLAUDE_MD, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, contenido: md }));
  } catch {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: false,
      error: 'No encontré tu CLAUDE.md. ¿Has hecho el Módulo 1 del curso?',
    }));
  }
}

async function endpointInventario(req, res) {
  const skills = await listarMd(CARPETA_SKILLS);
  const agentes = await listarMd(CARPETA_AGENTES);
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ ok: true, skills, agentes }));
}

async function listarMd(carpeta) {
  try {
    const archivos = await fs.readdir(carpeta);
    return archivos
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        nombre: f.replace('.md', ''),
        comando: '/' + f.replace('.md', ''),
      }));
  } catch {
    return [];
  }
}

async function endpointChat(req, res) {
  const apiKey = await cargarApiKey();
  if (!apiKey) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: false,
      error: 'Falta tu API key. Ejecuta /paz-encender en Claude Code para configurarla.',
    }));
    return;
  }

  let cuerpo = '';
  for await (const chunk of req) cuerpo += chunk;

  try {
    const { mensajes } = JSON.parse(cuerpo);
    const claudeMd = await fs.readFile(RUTA_CLAUDE_MD, 'utf-8').catch(() => '');

    const sistema = `Eres el Claude personal de un coach o terapeuta. Conoces su negocio porque tienes acceso a su archivo CLAUDE.md.

Tu voz es la del Laboratorio de Paz: directa, cálida, sin spiritual bypassing, con humor seco cuando aplica. Tuteas. Sentence case. Cero emojis salvo ✓ después de algo concreto.

Cuando respondas, ten en cuenta el CLAUDE.md del coach para personalizar todo. Sus respuestas son su voz, sus clientes, su transformación. Úsala.

CLAUDE.md del coach:

${claudeMd}`;

    const cliente = new Anthropic({ apiKey });
    const respuesta = await cliente.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: sistema,
      messages: mensajes,
    });

    const texto = respuesta.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, respuesta: texto }));
  } catch (error) {
    console.error('Error en chat:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: error.message }));
  }
}

// ─── Servir archivos estáticos ───────────────────────────────────────────────

async function servirEstatico(req, res) {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  urlPath = urlPath.split('?')[0];
  const archivo = path.join(__dirname, urlPath);

  try {
    const contenido = await fs.readFile(archivo);
    const ext = path.extname(archivo);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(contenido);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
}

// ─── Router ──────────────────────────────────────────────────────────────────

const servidor = http.createServer(async (req, res) => {
  if (req.url === '/api/claude-md') return endpointClaudeMd(req, res);
  if (req.url === '/api/inventario') return endpointInventario(req, res);
  if (req.url === '/api/chat' && req.method === 'POST') return endpointChat(req, res);
  return servirEstatico(req, res);
});

servidor.listen(PUERTO, () => {
  console.log('');
  console.log('  ✓ SO de Paz corriendo en http://localhost:' + PUERTO);
  console.log('');
  console.log('  Para apagarlo, pulsa Ctrl+C.');
  console.log('');
});
