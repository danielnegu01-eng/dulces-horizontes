let todasLasRecetas = [];

/**
 * Construye una URL de imagen segura:
 * - Usa la API URL para no romper parámetros existentes.
 * - Añade los parámetros de Unsplash/optimización correctamente.
 * - Soporta rutas relativas (se resuelven respecto a la página).
 * - Devuelve un placeholder si no existe URL válida.
 */
function buildImageUrl(original, width) {
  const placeholder = `https://via.placeholder.com/${width}x${Math.round(width * 0.66)}?text=Sin+imagen`;

  if (!original) return placeholder;

  try {
    // Si original es relativo, se resuelve contra la ubicación actual
    const u = new URL(original, window.location.href);

    // Ajustes comunes (Unsplash-friendly). Estos set reemplazan o agregan parámetros sin romper los previos.
    u.searchParams.set('auto', 'format');
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', '80');

    // En algunos casos algunas implementaciones esperan /photos/<id> en vez de /photo-...,
    // pero evitar reemplazos agresivos; la URL resultante con parámetros normalmente funciona.
    return u.href;
  } catch (err) {
    // Si URL() falla por cualquier razón, devolvemos placeholder
    console.warn('buildImageUrl: URL inválida, usando placeholder', original, err);
    return placeholder;
  }
}

// Cargar recetas
fetch('recetas.json')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response.json();
  })
  .then(recetas => {
    todasLasRecetas = Array.isArray(recetas) ? recetas : [];
    renderizarRecetas(todasLasRecetas);
  })
  .catch(error => {
    console.error(error);
    const grid = document.getElementById('recetas-grid');
    if (grid) {
      grid.innerHTML = '<p class="no-results">Error al cargar las recetas.</p>';
    }
  });

// Renderizar tarjetas
function renderizarRecetas(recetas) {
  const grid = document.getElementById('recetas-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!recetas || recetas.length === 0) {
    grid.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
    return;
  }

  recetas.forEach(receta => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.addEventListener('click', () => abrirModal(receta));

    const imageUrl = buildImageUrl(receta.imagen, 800);
    const placeholderSmall = `https://via.placeholder.com/800x533?text=Sin+imagen`;

    card.innerHTML = `
      <img
        src="${imageUrl}"
        alt="${escapeHtml(receta.nombre || 'Receta')}"
        loading="lazy"
        onerror="this.onerror=null;this.src='${placeholderSmall}'"
      >
      <div class="recipe-info">
        <h2>${escapeHtml(receta.nombre || '')}</h2>
        <p>${escapeHtml(receta.descripcion || '')}</p>
        <ul class="ingredients">
          ${Array.isArray(receta.ingredientes) ? receta.ingredientes.slice(0, 5).map(i => `<li>${escapeHtml(i)}</li>`).join('') : ''}
          ${Array.isArray(receta.ingredientes) && receta.ingredientes.length > 5 ? '<li>Y más ingredientes...</li>' : ''}
        </ul>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Modal
function abrirModal(receta) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalBody) return;

  const imageUrl = buildImageUrl(receta.imagen, 1200);
  const placeholderLarge = `https://via.placeholder.com/1200x800?text=Sin+imagen`;

  modalBody.innerHTML = `
    <img
      src="${imageUrl}"
      alt="${escapeHtml(receta.nombre || 'Receta')}"
      class="modal-img"
      onerror="this.onerror=null;this.src='${placeholderLarge}'"
    >
    <h2>${escapeHtml(receta.nombre || '')}</h2>
    <p><strong>Descripción:</strong> ${escapeHtml(receta.descripcion || '')}</p>
    <h3>Ingredientes:</h3>
    <ul>
      ${Array.isArray(receta.ingredientes) ? receta.ingredientes.map(i => `<li>${escapeHtml(i)}</li>`).join('') : ''}
    </ul>
    <h3>Instrucciones:</h3>
    <ol>
      ${Array.isArray(receta.instrucciones) ? receta.instrucciones.map(p => `<li>${escapeHtml(p)}</li>`).join('') : ''}
    </ol>
  `;

  modal.style.display = 'block';
}

// Cerrar modal
const closeBtn = document.querySelector('.close');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
  });
}

window.addEventListener('click', e => {
  if (e.target && e.target.id === 'modal') {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
  }
});

// Buscador
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    const termino = e.target.value.toLowerCase().trim();

    const filtradas = todasLasRecetas.filter(r => {
      const nombre = (r.nombre || '').toLowerCase();
      const descripcion = (r.descripcion || '').toLowerCase();
      const ingredientes = Array.isArray(r.ingredientes) ? r.ingredientes.map(i => (i || '').toLowerCase()) : [];
      return nombre.includes(termino) ||
             descripcion.includes(termino) ||
             ingredientes.some(i => i.includes(termino));
    });

    renderizarRecetas(filtradas);
  });
}

/**
 * Pequeña función para escapar HTML en los textos insertados en innerHTML
 * Evita inyección si los datos vienen de fuentes no confiables.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
