

export function renderRecipes(recipes) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.id = recipe.id;

    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <p class="click-hint">Haz clic para ver los detalles de la receta</p>
    `;

   

    container.appendChild(card);
  });

  // Listener para ver detalles
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const recipeId = card.dataset.id;
      import('./recipeDetails.js').then(module => {
        module.showRecipeDetails(recipeId);
      });
    });
  });
}
