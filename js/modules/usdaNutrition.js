// usdaNutrition.js
// Fetches nutrition data from USDA FoodData Central
// Obtiene datos nutricionales desde USDA FoodData Central

const API_KEY = '15UUDxfXsPh6LA2ObKveCLCBuLrC5LwoCAqULr6l';
const SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const DETAIL_URL = 'https://api.nal.usda.gov/fdc/v1/food/';

// Retrieves cached nutrition data from localStorage
// Recupera datos nutricionales almacenados en caché
function getCachedNutrition(query) {
  const cache = JSON.parse(localStorage.getItem('nutritionCache')) || {};
  return cache[query.toLowerCase()] || null;
}

// Stores nutrition data in localStorage cache
// Guarda datos nutricionales en caché local
function setCachedNutrition(query, data) {
  const cache = JSON.parse(localStorage.getItem('nutritionCache')) || {};
  cache[query.toLowerCase()] = data;
  localStorage.setItem('nutritionCache', JSON.stringify(cache));
}

// Searches for ingredient and returns fdcId
// Busca el ingrediente y devuelve su fdcId
export async function searchIngredient(query) {
  const url = `${SEARCH_URL}?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.foods && data.foods.length > 0) {
    const genericFood = data.foods.find(f =>
      f.dataType === 'Survey (FNDDS)' || f.dataType === 'Foundation'
    );
    const selectedFood = genericFood || data.foods[0];
    console.log(`🔎 "${query}" → tipo: ${selectedFood.dataType}, fdcId: ${selectedFood.fdcId}`);
    return selectedFood.fdcId;
  }

  return null;
}

// Fetches nutrition data for a given fdcId
// Obtiene datos nutricionales para un fdcId dado
async function getNutritionData(fdcId, query) {
  const url = `${DETAIL_URL}${fdcId}?api_key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(`📄 JSON completo para "${query}":`, data);

  if (!data.foodNutrients || data.foodNutrients.length === 0) {
    console.warn(`⚠️ No hay nutrientes para "${query}" con fdcId ${fdcId}`);
    return null;
  }

  const nutrients = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  };

  data.foodNutrients.forEach(n => {
    if (!n.nutrient || typeof n.amount !== 'number') return;

    const name = n.nutrient.name.toLowerCase();
    const value = parseFloat(n.amount);

    if (name.includes('energy') || name.includes('calories')) {
      nutrients.calories = value;
    } else if (name.includes('protein')) {
      nutrients.protein = value;
    } else if (name.includes('fat') || name.includes('lipid')) {
      nutrients.fat = value;
    } else if (name.includes('carbohydrate')) {
      nutrients.carbs = value;
    }
  });

  console.log(`📊 DEBUG → ${query}:`, nutrients);
  return nutrients;
}

// Main function to fetch nutrition for an ingredient
// Función principal para obtener nutrición de un ingrediente
export async function fetchNutritionForIngredient(ingredient) {
  const cached = getCachedNutrition(ingredient);
  if (cached) return cached;

  const fdcId = await searchIngredient(ingredient);
  if (!fdcId) {
    console.warn(`❌ No se encontró fdcId para "${ingredient}"`);
    return null;
  }

  const nutrition = await getNutritionData(fdcId, ingredient);
  if (!nutrition) return null;

  setCachedNutrition(ingredient, nutrition);
  return nutrition;
}
