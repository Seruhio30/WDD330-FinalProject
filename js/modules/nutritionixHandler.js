// nutritionixHandler.js
// Nutrition lookup using Nutritionix v2 natural language endpoint

const APP_ID = '0bf1361c';
const APP_KEY = '2583013ee2c8900622a5be83fc87b643';
const BASE_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

function getCachedNutrition(query) {
  const cache = JSON.parse(localStorage.getItem('nutritionCache')) || {};
  return cache[query.toLowerCase()] || null;
}

function setCachedNutrition(query, data) {
  const cache = JSON.parse(localStorage.getItem('nutritionCache')) || {};
  cache[query.toLowerCase()] = data;
  localStorage.setItem('nutritionCache', JSON.stringify(cache));
}

export async function fetchNutritionForIngredient(ingredient) {
  const cached = getCachedNutrition(ingredient);
  if (cached) return cached;

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'x-app-id': APP_ID,
        'x-app-key': APP_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: `1 ${ingredient}` })
    });

    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
      console.warn(`❌ No se encontraron datos para "${ingredient}"`);
      return null;
    }

    const item = data.foods[0];
    const nutrition = {
      calories: item.nf_calories || 0,
      protein: item.nf_protein || 0,
      fat: item.nf_total_fat || 0,
      carbs: item.nf_total_carbohydrate || 0
    };

    setCachedNutrition(ingredient, nutrition);
    return nutrition;

  } catch (err) {
    console.error(`⚠️ Error al buscar nutrición para "${ingredient}":`, err);
    return null;
  }
}
