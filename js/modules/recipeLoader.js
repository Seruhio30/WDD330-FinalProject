


import { showRecipeDetails } from './js/modules/recipeDetails.js';




const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  showRecipeDetails(id);
} else {
  document.getElementById('results').innerHTML = '<p>❌ No se encontró ninguna receta.</p>';
}