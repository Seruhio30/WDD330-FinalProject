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

// Estimates nutrition based on user ingredients using USDA API
// Estima nutrición basada en ingredientes del usuario usando la API de USDA
export async function renderEstimatedNutrition(userIngredients) {
  if (!Array.isArray(userIngredients)) {
    console.error('renderEstimatedNutrition recibió un tipo inválido:', userIngredients);
    return;
  }

  const container = document.getElementById('results');
  container.innerHTML = ''; // Clear previous results
  const loading = document.createElement('p');
  loading.textContent = 'Calculando nutrición estimada...';
  container.appendChild(loading);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  const sinDatos = []; // Ingredients with no data

  for (const ing of userIngredients) {
    console.log(`🔍 Buscando nutrición para "${ing}"`);
    const nutrition = await fetchNutritionForIngredient(ing);
    console.log(`📥 Recibido para "${ing}":`, nutrition);

    if (!nutrition || (
      nutrition.calories === 0 &&
      nutrition.protein === 0 &&
      nutrition.fat === 0 &&
      nutrition.carbs === 0
    )) {
      sinDatos.push(ing);
      continue;
    }

    totalCalories += nutrition.calories;
    totalProtein += nutrition.protein;
    totalFat += nutrition.fat;
    totalCarbs += nutrition.carbs;
  }

  container.removeChild(loading);

  const box = document.createElement('div');
  box.className = 'nutrition-box';

  if (sinDatos.length === userIngredients.length) {
    console.log(`📈 Totales → Cal: ${totalCalories}, Prot: ${totalProtein}, Fat: ${totalFat}, Carb: ${totalCarbs}`);
    box.innerHTML = `
      <h3>Nutrición estimada</h3>
      <p class="note">⚠️ No se encontraron datos nutricionales útiles para los ingredientes ingresados.</p>
    `;
  } else {
    box.innerHTML = `
      <h3>Nutrición estimada</h3>
      <ul>
        <li>Calorías: ${totalCalories.toFixed(1)} kcal</li>
        <li>Proteínas: ${totalProtein.toFixed(1)} g</li>
        <li>Grasas: ${totalFat.toFixed(1)} g</li>
        <li>Carbohidratos: ${totalCarbs.toFixed(1)} g</li>
      </ul>
      <p class="note">* Basado en: ${userIngredients.filter(i => !sinDatos.includes(i)).join(', ')}.</p>
      ${sinDatos.length > 0 ? `<p class="note">⚠️ Sin datos para: ${sinDatos.join(', ')}</p>` : ''}
    `;
  }

  container.appendChild(box);
}
