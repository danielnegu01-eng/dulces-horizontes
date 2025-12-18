let todasLasRecetas = [];

fetch('recetas.json')
  .then(r => r.json())
  .then(data => {
    todasLasRecetas = data;
    renderizarRecetas(todasLasRecetas);
  })
  .catch(() => {
    document.getElementById('recetas-grid').innerHTML =
      '<p class="no-results">Error al cargar las recetas.</p>';
  });

function renderizarRecetas(recetas) {
  const grid = document.getElementById('recetas-grid');
  grid.innerHTML = '';

  recetas.forEach(receta => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => abrirModal(receta);

    card.innerHTML = `
      <img
        src="${receta.imagen}?auto=format&fit=crop&w=800&q=80"
        alt="${receta.nombre}"
        loading="lazy"
        referrerpolicy="no-referrer"
        crossorigin="anonymous"
        decoding="async"
      >
      <div class="recipe-info">
        <h2>${receta.nombre}</h2>
        <p>${receta.descripcion}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

function abrirModal(receta) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');

  body.innerHTML = `
    <img
      src="${receta.imagen}?auto=format&fit=crop&w=1200&q=80"
      alt="${receta.nombre}"
      class="modal-img"
      referrerpolicy="no-referrer"
      crossorigin="anonymous"
      decoding="async"
    >
    <h2>${receta.nombre}</h2>
    <p>${receta.descripcion}</p>
  `;

  modal.style.display = 'block';
}

document.querySelector('.close').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};

window.onclick = e => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
};
