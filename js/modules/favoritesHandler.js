export function saveToFavorites(id, title) {
    let stored;
    try {
        stored = JSON.parse(localStorage.getItem('favorites'));
        if (!Array.isArray(stored)) stored = [];
    } catch {
        stored = [];
    }

    const exist = stored.find(item => item === id);
    if (exist) return;

    stored.push({ id, title });
    localStorage.setItem('favorites', JSON.stringify(Storage));
    console.log(`✅ Guardado en favoritos: ${title} (ID: ${id})`);


}