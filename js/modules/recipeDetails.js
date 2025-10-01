export async function showRecipeDetails(id) {
  const apiKey = '3486456142aa411da24e68f88aa2348b';
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  renderDetails(data);
}

//esta funcion me alista el terreno para ver los detalles de la recta
function renderDetails(recipe) {
  const container = document.getElementById('results');
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
    <button onclick="location.reload()">🔙 Volver</button>
  `;
}
