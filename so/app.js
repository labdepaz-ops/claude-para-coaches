// SO de Paz · Lógica del frontend
// Laboratorio de Paz

// ─── Definición de los 8 pilares ─────────────────────────────────────────────

const PILARES = [
  { id: 'esencia',     nombre: 'Esencia',     descripcion: 'Quién eres y qué haces' },
  { id: 'vision',      nombre: 'Visión',      descripcion: 'A dónde vas en 12 meses' },
  { id: 'cliente',     nombre: 'Cliente',     descripcion: 'A quién sirves de verdad' },
  { id: 'oferta',      nombre: 'Oferta',      descripcion: 'Qué entregas y por qué eligen' },
  { id: 'atraccion',   nombre: 'Atracción',   descripcion: 'Cómo te encuentran' },
  { id: 'conversion',  nombre: 'Conversión',  descripcion: 'Cómo se vuelven clientes' },
  { id: 'entrega',     nombre: 'Entrega',     descripcion: 'Cómo trabajas con ellos' },
  { id: 'estructura',  nombre: 'Estructura',  descripcion: 'Cómo sostienes el negocio' },
];

// ─── Mapeo de secciones del CLAUDE.md a pilares ──────────────────────────────

const MAPEO_SECCIONES = {
  'identidad':                  'esencia',
  'mi cliente real':            'cliente',
  'la transformación que entrego': 'oferta',
  'por qué me eligen a mí':     'oferta',
  'mi zona de genialidad':      'entrega',
  'mi voz':                     'esencia',
  'lo que rechazo del nicho':   'esencia',
  'mi visión a 12 meses':       'vision',
};

// ─── Estado global ───────────────────────────────────────────────────────────

let claudeMd = null;
let pilaresEstado = {};
let mensajesHistorial = [];

// ─── Parsear CLAUDE.md y mapear a pilares ────────────────────────────────────

function parsearClaudeMd(md) {
  const secciones = {};
  const lineas = md.split('\n');
  let seccionActual = null;
  let buffer = [];

  for (const linea of lineas) {
    const matchH2 = linea.match(/^##\s+(.+)$/);
    if (matchH2) {
      if (seccionActual) {
        secciones[seccionActual.toLowerCase().trim()] = buffer.join('\n').trim();
      }
      seccionActual = matchH2[1];
      buffer = [];
    } else if (seccionActual) {
      buffer.push(linea);
    }
  }
  if (seccionActual) {
    secciones[seccionActual.toLowerCase().trim()] = buffer.join('\n').trim();
  }
  return secciones;
}

function mapearPilares(secciones) {
  const estado = {};
  for (const pilar of PILARES) {
    estado[pilar.id] = { tieneInfo: false, contenido: '' };
  }
  for (const [seccion, contenido] of Object.entries(secciones)) {
    const pilarId = MAPEO_SECCIONES[seccion];
    if (pilarId && contenido && !contenido.includes('no lo sé')) {
      estado[pilarId].tieneInfo = true;
      if (estado[pilarId].contenido) {
        estado[pilarId].contenido += '\n\n' + contenido;
      } else {
        estado[pilarId].contenido = contenido;
      }
    }
  }
  return estado;
}

// ─── Renderizar mapa de pilares ──────────────────────────────────────────────

function renderizarPilares() {
  const contenedor = document.getElementById('lista-pilares');
  contenedor.innerHTML = '';
  for (const pilar of PILARES) {
    const estado = pilaresEstado[pilar.id];
    const div = document.createElement('div');
    div.className = 'pilar ' + (estado.tieneInfo ? 'pilar-lleno' : 'pilar-vacio');
    div.innerHTML = `
      <div class="pilar-cabecera">
        <span class="pilar-nombre">${pilar.nombre}</span>
        <span class="pilar-marca">${estado.tieneInfo ? '●' : '○'}</span>
      </div>
      <div class="pilar-descripcion">${pilar.descripcion}</div>
    `;
    contenedor.appendChild(div);
  }
}

// ─── Cargar CLAUDE.md desde el servidor ──────────────────────────────────────

async function cargarClaudeMd() {
  try {
    const res = await fetch('/api/claude-md');
    const data = await res.json();
    if (data.ok) {
      claudeMd = data.contenido;
      const secciones = parsearClaudeMd(claudeMd);
      pilaresEstado = mapearPilares(secciones);
      renderizarPilares();
      document.getElementById('estado-claude').textContent = 'conectado · CLAUDE.md cargado';
      document.getElementById('estado-claude').classList.add('estado-ok');
    } else {
      document.getElementById('lista-pilares').innerHTML =
        '<div class="aviso">' + data.error + '</div>';
      document.getElementById('estado-claude').textContent = 'sin CLAUDE.md';
    }
  } catch (e) {
    document.getElementById('lista-pilares').innerHTML =
      '<div class="aviso">No pude cargar tu CLAUDE.md.</div>';
  }
}

// ─── Cargar inventario de skills y agentes ───────────────────────────────────

async function cargarInventario() {
  try {
    const res = await fetch('/api/inventario');
    const data = await res.json();
    renderizarLista('lista-skills', data.skills, 'Aún no has construido ninguna skill. Ejecuta /paz-skill en Claude Code.');
    renderizarLista('lista-agentes', data.agentes, 'Aún no has construido ningún agente. Ejecuta /paz-agente en Claude Code.');
  } catch (e) {
    document.getElementById('lista-skills').innerHTML = '<div class="aviso">Error al cargar.</div>';
    document.getElementById('lista-agentes').innerHTML = '<div class="aviso">Error al cargar.</div>';
  }
}

function renderizarLista(idContenedor, items, mensajeVacio) {
  const contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = '';
  if (items.length === 0) {
    contenedor.innerHTML = `<div class="vacio">${mensajeVacio}</div>`;
    return;
  }
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'comando';
    div.innerHTML = `
      <div class="comando-info">
        <span class="comando-nombre">${item.nombre}</span>
        <code class="comando-codigo">${item.comando}</code>
      </div>
      <button class="comando-copiar" data-comando="${item.comando}">copiar</button>
    `;
    contenedor.appendChild(div);
  }
  contenedor.querySelectorAll('.comando-copiar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const comando = e.target.dataset.comando;
      await navigator.clipboard.writeText(comando);
      const original = e.target.textContent;
      e.target.textContent = 'copiado ✓';
      setTimeout(() => { e.target.textContent = original; }, 1500);
    });
  });
}

// ─── Chat ────────────────────────────────────────────────────────────────────

async function enviarMensaje(texto) {
  mensajesHistorial.push({ role: 'user', content: texto });
  pintarMensaje(texto, 'usuario');
  pintarPensando();

  const boton = document.getElementById('chat-boton');
  boton.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajes: mensajesHistorial }),
    });
    const data = await res.json();
    quitarPensando();
    if (data.ok) {
      mensajesHistorial.push({ role: 'assistant', content: data.respuesta });
      pintarMensaje(data.respuesta, 'claude');
    } else {
      pintarMensaje('Error: ' + data.error, 'error');
    }
  } catch (e) {
    quitarPensando();
    pintarMensaje('No pude conectar con el servidor: ' + e.message, 'error');
  } finally {
    boton.disabled = false;
  }
}

function pintarMensaje(texto, tipo) {
  const historial = document.getElementById('chat-historial');
  const div = document.createElement('div');
  div.className = 'mensaje mensaje-' + tipo;
  // Convertir saltos de línea a párrafos y cursivas a <em>
  const parrafos = texto.split('\n\n');
  for (const p of parrafos) {
    if (!p.trim()) continue;
    const pEl = document.createElement('p');
    pEl.innerHTML = p.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    div.appendChild(pEl);
  }
  historial.appendChild(div);
  historial.scrollTop = historial.scrollHeight;
}

function pintarPensando() {
  const historial = document.getElementById('chat-historial');
  const div = document.createElement('div');
  div.className = 'mensaje mensaje-claude mensaje-pensando';
  div.id = 'mensaje-pensando';
  div.innerHTML = '<p>…</p>';
  historial.appendChild(div);
  historial.scrollTop = historial.scrollHeight;
}

function quitarPensando() {
  const el = document.getElementById('mensaje-pensando');
  if (el) el.remove();
}

// ─── Inicialización ──────────────────────────────────────────────────────────

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  enviarMensaje(texto);
});

document.getElementById('chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('chat-form').dispatchEvent(new Event('submit'));
  }
});

cargarClaudeMd();
cargarInventario();
