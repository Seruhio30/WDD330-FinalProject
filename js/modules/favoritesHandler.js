export function saveToFavorites(id, title) {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem('favorites'));
    if (!Array.isArray(stored)) stored = [];
  } catch {
    stored = [];
  }

  const exists = stored.some(item => item.id === id);
  if (!exists) {
    stored.push({ id, title });
    localStorage.setItem('favorites', JSON.stringify(stored));
    console.log(`✅ Guardado en favoritos: ${title}`);
  }
}
