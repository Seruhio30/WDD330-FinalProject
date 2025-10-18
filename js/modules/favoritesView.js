function renderFavorites() {
  const container = document.getElementById('favoritesContainer');
  let stored;
  try {
    const raw = localStorage.getItem('favorites');
    stored = JSON.parse(raw);
    if (!Array.isArray(stored)) stored = [];
  } catch {
    stored = [];
  }

  container.innerHTML = ''; // Limpia antes de renderizar

  if (stored.length === 0) {
    container.innerHTML = '<p>No hay recetas favoritas guardadas.</p>';
    return;
  }

  stored.forEach(({ id, title, image }) => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.id = id;

    card.innerHTML = `
      <h3>${title}</h3>
      <img src="${image}" alt="${title}" />
      <a href="recipe.html?id=${id}" class="view-link">Ver receta</a>
      <button data-id="${id}" class="remove-btn">Eliminar</button>
    `;

    container.appendChild(card);
  });

  container.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const id = parseInt(e.target.dataset.id);
      removeFavorite(id);
      const card = e.target.closest('.recipe-card');
      if (card) card.remove();
    }
  });
  console.log('Renderizando favoritos:', stored);

}



function removeFavorite(id) {
  let stored = JSON.parse(localStorage.getItem('favorites')) || [];
  stored = stored.filter(r => r.id !== id);
  localStorage.setItem('favorites', JSON.stringify(stored));
  renderFavorites(); // 🔁 Actualiza la vista
}

document.addEventListener('DOMContentLoaded', renderFavorites);


// Ejecutar al cargar
renderFavorites();
