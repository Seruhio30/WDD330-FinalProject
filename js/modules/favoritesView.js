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

  if (stored.length === 0) {
    container.innerHTML = '<p>No hay recetas favoritas guardadas.</p>';
    return;
  }

  stored.forEach(({ id, title }) => {
    const box = document.createElement('div');
    box.className = 'fav-box';
    box.innerHTML = `
      <h3>${title}</h3>
      <button data-id="${id}" class="remove-btn">Eliminar</button>
    `;
    container.appendChild(box);
  });

  container.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const id = parseInt(e.target.dataset.id);
      removeFavorite(id);
      e.target.parentElement.remove();
    }
  });
}

function removeFavorite(id) {
  const stored = JSON.parse(localStorage.getItem('favorites')) || [];
  const updated = stored.filter(item => item.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updated));
  console.log(`🗑️ Eliminado de favoritos: ID ${id}`);
}

// Ejecutar al cargar
renderFavorites();
