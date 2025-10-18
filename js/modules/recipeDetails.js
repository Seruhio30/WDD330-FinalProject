// recipeDetails.js
// Displays full recipe details and connects nutrition estimation
// Muestra detalles completos de la receta y conecta la estimación nutricional

import { renderRecipes } from './resultsView.js'; // Para volver a la lista
import { fetchNutritionForIngredient } from './nutritionixHandler.js';
import { lastIngredients, lastResults } from './ingredientSearch.js';
import { saveToFavorites } from './favoritesHandler.js';


// Fetches full recipe info from Spoonacular by ID
// Obtiene información completa de la receta desde Spoonacular por ID
export async function showRecipeDetails(id) {
  const apiKey = '3486456142aa411da24e68f88aa2348b';
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderDetails(data, lastIngredients); // Usamos array vacío si no hay ingredientes
  } catch (error) {
    document.getElementById('results').innerHTML = '<p>❌ Error al cargar la receta.</p>';
    console.error('Error al obtener receta:', error);
  }
}



// Renders recipe details and connects buttons
// Renderiza los detalles de la receta y conecta los botones 
export function renderDetails(recipe, userIngredients) {
  const container = document.getElementById('results');
  container.className = 'recipe-details';
  container.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}" />
    <p><strong>Tiempo estimado:</strong> ${recipe.readyInMinutes} minutos</p>
    <h3>Ingredientes:</h3>
    <ul>
      ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
    </ul>
    <h3>Procedimiento:</h3>
    <p>${recipe.instructions || 'No hay instrucciones disponibles.'}</p>
    
    <button id="backBtn">🔙 Volver</button>
    <button class="btn secondary" id="shareBtn">🔗 Compartir receta</button>
  `;

  // Botón de compartir receta
  document.getElementById('shareBtn').addEventListener('click', () => {
   const recipeUrl = `https://seruhio30.github.io/WDD330-FinalProject/recipe.html?id=${recipe.id}`;

    navigator.clipboard.writeText(recipeUrl)
      .then(() => {
        alert('📋 Enlace copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar enlace:', err);
        alert('❌ No se pudo copiar el enlace');
      });
  });

  // Botón de favoritos ♥


  const favBtn = document.createElement('button');
  favBtn.textContent = '♥';
  favBtn.className = 'fav-btn';
  favBtn.style.margin = '10px';

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('🖼️ Imagen de receta:', recipe.image);

    saveToFavorites(recipe.id, recipe.title, recipe.image);
    favBtn.textContent = '❤️';

    // Activar animación
    favBtn.classList.add('saved');
    setTimeout(() => favBtn.classList.remove('saved'), 400);
  });


  // Insertar el botón justo después del título
  const titleElement = container.querySelector('h2');
  titleElement.insertAdjacentElement('afterend', favBtn);

  // Botón para volver a la lista de recetas
  document.getElementById('backBtn').addEventListener('click', () => {
    container.className = '';
    container.innerHTML = ''; // 🔧 limpia el contenido
    renderRecipes(lastResults); // 🔁 vuelve a mostrar la lista
  });

  // Botón para activar estimación nutricional
  const nutritionBtn = document.createElement('button');
  nutritionBtn.textContent = 'Ver nutrición estimada';
  nutritionBtn.id = 'nutritionEstimateBtn';
  container.appendChild(nutritionBtn);

  nutritionBtn.addEventListener('click', async () => {
    await renderNutritionBox(userIngredients);
  });
}

// Renders estimated nutrition using API Ninjas
// Renderiza nutrición estimada usando API Ninjas
export async function renderNutritionBox(ingredients) {
  const container = document.getElementById('results');
  const box = document.createElement('div');
  box.className = 'nutrition-box';
  box.innerHTML = '<p>Calculando nutrición estimada...</p>';
  container.appendChild(box);

  let total = { calories: 0, protein: 0, fat: 0, carbs: 0 };
  const sinDatos = [];

  for (const ing of ingredients) {
    const data = await fetchNutritionForIngredient(ing);
    if (!data) {
      sinDatos.push(ing);
      continue;
    }
    total.calories += data.calories;
    total.protein += data.protein;
    total.fat += data.fat;
    total.carbs += data.carbs;
  }

  box.innerHTML = `
    <h3>Nutrición estimada</h3>
    <ul>
      <li>Calorías: ${total.calories.toFixed(1)} kcal</li>
      <li>Proteínas: ${total.protein.toFixed(1)} g</li>
      <li>Grasas: ${total.fat.toFixed(1)} g</li>
      <li>Carbohidratos: ${total.carbs.toFixed(1)} g</li>
    </ul>
    ${sinDatos.length > 0 ? `<p class="note">⚠️ Sin datos para: ${sinDatos.join(', ')}</p>` : ''}
  `;
}


