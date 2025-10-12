import {
  handleSearch,
  saveSearchHistory,
  renderSearchHistory
} from './modules/ingredientSearch.js';

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('ingredientInput').value.trim();
  if (!query) return;

  saveSearchHistory(query);       // Guarda en historial
  renderSearchHistory();          // Muestra historial actualizado
  handleSearch();                 // Ejecuta búsqueda y guarda lastResults
});

window.addEventListener('DOMContentLoaded', () => {
  renderSearchHistory();          // Muestra historial al cargar
});
