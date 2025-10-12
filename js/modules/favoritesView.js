//favorites view
const container = document.getElementById('favoritesContainer');
const stored = JSON.parse(localStorage.getItem('favorites')) || [];

stored.forEach(({id, title}) => {
    const box = document.createElement('div');
    box.className = ('fav-box');
    box.innerHTML= `
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

function removeFavorite(id) {
  const stored = JSON.parse(localStorage.getItem('favorites')) || [];
  const updated = stored.filter(item => item.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updated));
  console.log(`🗑️ Eliminado de favoritos: ID ${id}`);

}