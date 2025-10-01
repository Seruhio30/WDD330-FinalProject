export async function fetchRecipes(ingredients, mealType = '', diet = '') {
  const apiKey = '3486456142aa411da24e68f88aa2348b';
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&includeIngredients=${ingredients}&type=${mealType}&diet=${diet}&number=5`;

  const res = await fetch(url);
  const data = await res.json();
  console.log('API response:', data); // Verifica estructura
  return data;
}
