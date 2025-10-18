export function saveToFavorites(id, title, image) {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem('favorites'));
    if (!Array.isArray(stored)) stored = [];
  } catch {
    stored = [];
  }

  const exists = stored.some(item => item.id === id);
  if (!exists) {
    stored.push({ id, title, image });
    localStorage.setItem('favorites', JSON.stringify(stored));



  }
}
