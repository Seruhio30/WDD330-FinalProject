import { fetchRecipes } from './apiHandler.js';
import { renderRecipes } from './resultsView.js';

export async function handleSearch() {
  const rawInput = document.getElementById('ingredientInput').value;
  const ingredients = rawInput.split(',').map(i => i.trim().toLowerCase()).join(',');
  const mealType = document.getElementById('mealType').value;
  const diet = document.getElementById('diet').value;

  const data = await fetchRecipes(ingredients, mealType, diet);

if (data && data.results && data.results.length > 0) {
  renderRecipes(data.results);
} else {
  const message = `No se encontraron recetas con esos ingredientes en la categoría "${mealType || 'cualquiera'}" y dieta "${diet || 'sin restricción'}".`;
  document.getElementById('results').innerHTML = `<p>${message}</p>`;
}

}

 