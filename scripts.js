let todasLasRecetas = [];

fetch('recetas.json')
    .then(response => response.json())
    .then(recetas => {
        todasLasRecetas = recetas;
        renderizarRecetas(todasLasRecetas);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('recetas-grid').innerHTML = '<p class="no-results">Error al cargar las recetas.</p>';
    });

function renderizarRecetas(recetas) {
    const grid = document.getElementById('recetas-grid');
    grid.innerHTML = '';

    if (recetas.length === 0) {
        grid.innerHTML = '<p class="no-results">No se encontraron delicias que coincidan con tu búsqueda.</p>';
        return;
    }

    recetas.forEach(receta => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => abrirModal(receta);

        card.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.nombre}">
            <div class="recipe-info">
                <h2>${receta.nombre}</h2>
                <p>${receta.descripcion}</p>
                <ul class="ingredients">
                    ${receta.ingredientes.slice(0, 5).map(ing => `<li>${ing}</li>`).join('')}
                    ${receta.ingredientes.length > 5 ? '<li>Y más ingredientes...</li>' : ''}
                </ul>
            </div>
        `;
        grid.appendChild(card);
    });
}

function abrirModal(receta) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <img src="${receta.imagen}" alt="${receta.nombre}" class="modal-img">
        <h2>${receta.nombre}</h2>
        <p><strong>Descripción:</strong> ${receta.descripcion}</p>
        <h3>Ingredientes:</h3>
        <ul>
            ${receta.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <h3>Instrucciones paso a paso:</h3>
        <ol>
            ${receta.instrucciones.map(paso => `<li>${paso}</li>`).join('')}
        </ol>
    `;

    modal.style.display = 'block';
}

document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
};

window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

document.getElementById('search-input').addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();

    const filtradas = todasLasRecetas.filter(receta => {
        return receta.nombre.toLowerCase().includes(termino) ||
               receta.descripcion.toLowerCase().includes(termino) ||
               receta.ingredientes.some(ing => ing.toLowerCase().includes(termino));
    });

    renderizarRecetas(filtradas);
});
