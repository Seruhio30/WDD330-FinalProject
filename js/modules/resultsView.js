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
    `;
    container.appendChild(card);
  });

  //aqui llamaremos a la lista de ingredientes pasos tiempo y mas con listener
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const recipeId = card.dataset.id;
      import('./recipeDetails.js').then(module => {
        module.showRecipeDetails(recipeId);
      });
    });
  });

}
