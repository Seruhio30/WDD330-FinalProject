// ingredientSearch.js
// Handles ingredient-based recipe search and estimated nutrition
// Maneja la búsqueda de recetas por ingredientes y nutrición estimada

import { fetchRecipes } from './apiHandler.js'; // Spoonacular recipe search
import { renderRecipes } from './resultsView.js'; // Render recipe cards


// Temporary test block for USDA API (can be removed or moved to a test file)
// Bloque de prueba temporal para la API de USDA (puede eliminarse o moverse a un archivo de prueba)
(async () => {
  const fdcId = 2706371; // beef
  const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=15UUDxfXsPh6LA2ObKveCLCBuLrC5LwoCAqULr6l`;
  const response = await fetch(url);
  const data = await response.json();

  const nutrients = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  };

  data.foodNutrients.forEach(n => {
    if (!n.nutrient || typeof n.nutrient.name !== 'string' || typeof n.amount !== 'number') return;

    const name = n.nutrient.name.toLowerCase();
    const value = parseFloat(n.amount);

    if (name.includes('energy')) nutrients.calories = value;
    if (name.includes('protein')) nutrients.protein = value;
    if (name.includes('fat') || name.includes('lipid')) nutrients.fat = value;
    if (name.includes('carbohydrate')) nutrients.carbs = value;
  });
})();

// Stores last search results and ingredients for reuse
// Guarda los últimos resultados e ingredientes para reutilización
export let lastResults = [];
export let lastIngredients = [];

// Main search handler triggered by search button
// Manejador principal de búsqueda activado por el botón de búsqueda
export async function handleSearch() {
  const rawInput = document.getElementById('ingredientInput').value;
  const ingredientArray = rawInput.split(',').map(i => i.trim().toLowerCase());
  lastIngredients = ingredientArray; // Save for nutrition module

  const ingredients = ingredientArray.join(',');
  const mealType = document.getElementById('mealType').value;
  const diet = document.getElementById('diet').value;

  const data = await fetchRecipes(ingredients, mealType, diet); // Spoonacular API call

  if (data && data.results && data.results.length > 0) {
    lastResults = data.results;
    renderRecipes(data.results); // Show recipe cards
  } else {
    const message = `No se encontraron recetas con esos ingredientes en la categoría "${mealType || 'cualquiera'}" y dieta "${diet || 'sin restricción'}".`;
    document.getElementById('results').innerHTML = `<p>${message}</p>`;
  }

}



export function saveSearchHistory(query) {
  const stored = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const updated = [query, ...stored.filter(item => item !== query)].slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(updated));
}

export function renderSearchHistory() {
  const container = document.getElementById('searchHistoryContainer');
  const stored = JSON.parse(localStorage.getItem('searchHistory')) || [];

  container.innerHTML = '<h4>Historial:</h4>';
  stored.forEach(query => {
    const btn = document.createElement('button');
    btn.textContent = query;
    btn.className = 'history-btn';
    btn.addEventListener('click', () => {
      document.getElementById('ingredientInput').value = query;
      document.getElementById('searchBtn').click();
    });
    container.appendChild(btn);
  });
}


