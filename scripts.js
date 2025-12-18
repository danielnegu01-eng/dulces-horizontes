let todasLasRecetas = [];

// Cargar recetas
fetch('recetas.json')
  .then(response => response.json())
  .then(recetas => {
    todasLasRecetas = recetas;
    renderizarRecetas(todasLasRecetas);
  })
  .catch(error => {
    console.error(error);
    document.getElementById('recetas-grid').innerHTML =
      '<p class="no-results">Error al cargar las recetas.</p>';
  });

// Renderizar tarjetas
function renderizarRecetas(recetas) {
  const grid = document.getElementById('recetas-grid');
  grid.innerHTML = '';

  if (recetas.length === 0) {
    grid.innerHTML =
      '<p class="no-results">No se encontraron resultados.</p>';
    return;
  }

  recetas.forEach(receta => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => abrirModal(receta);

    // 🔧 CORRECCIÓN REAL DE UNSPLASH
    const imagenCorregida = receta.imagen
      .replace('https://images.unsplash.com/photo-', 'https://images.unsplash.com/photos/');

    card.innerHTML = `
      <img
        src="${imagenCorregida}?auto=format&fit=crop&w=800&q=80"
        alt="${receta.nombre}"
        loading="lazy"
      >
      <div class="recipe-info">
        <h2>${receta.nombre}</h2>
        <p>${receta.descripcion}</p>
        <ul class="ingredients">
          ${receta.ingredientes.slice(0, 5).map(i => `<li>${i}</li>`).join('')}
          ${receta.ingredientes.length > 5 ? '<li>Y más ingredientes...</li>' : ''}
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

  const imagenCorregida = receta.imagen
    .replace('https://images.unsplash.com/photo-', 'https://images.unsplash.com/photos/');

  modalBody.innerHTML = `
    <img
      src="${imagenCorregida}?auto=format&fit=crop&w=1200&q=80"
      alt="${receta.nombre}"
      class="modal-img"
    >
    <h2>${receta.nombre}</h2>
    <p><strong>Descripción:</strong> ${receta.descripcion}</p>
    <h3>Ingredientes:</h3>
    <ul>
      ${receta.ingredientes.map(i => `<li>${i}</li>`).join('')}
    </ul>
    <h3>Instrucciones:</h3>
    <ol>
      ${receta.instrucciones.map(p => `<li>${p}</li>`).join('')}
    </ol>
  `;

  modal.style.display = 'block';
}

// Cerrar modal
document.querySelector('.close').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};

window.onclick = e => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
};

// Buscador
document.getElementById('search-input').addEventListener('input', e => {
  const termino = e.target.value.toLowerCase().trim();

  const filtradas = todasLasRecetas.filter(r =>
    r.nombre.toLowerCase().includes(termino) ||
    r.descripcion.toLowerCase().includes(termino) ||
    r.ingredientes.some(i => i.toLowerCase().includes(termino))
  );

  renderizarRecetas(filtradas);
});
