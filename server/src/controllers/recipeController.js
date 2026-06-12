const recipeModel = require('../models/recipeModel');

const formatRecipeResponse = (recipe) => ({
  id: recipe.id,
  title: recipe.title,
  description: recipe.description,
  instructions: recipe.instructions,
  preparationTimeMinutes: recipe.preparation_time_minutes,
  cookingTimeMinutes: recipe.cooking_time_minutes,
  servings: recipe.servings,
  difficulty: recipe.difficulty,
  isPublic: Boolean(recipe.is_public),
  category: recipe.category_name,
  createdBy: recipe.created_by,
  createdAt: recipe.created_at,
  updatedAt: recipe.updated_at,
  links: {
    self: `/api/recipes/${recipe.id}`,
    reviews: `/api/recipes/${recipe.id}/reviews`,
    favourite: `/api/favourites`
  }
});

const validateRecipeId = (id) => {
  const recipeId = Number(id);
  return Number.isInteger(recipeId) && recipeId > 0 ? recipeId : null;
};

const getRecipes = async (ctx) => {
  const recipes = await recipeModel.getAllRecipes();

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    count: recipes.length,
    data: recipes.map(formatRecipeResponse)
  };
};

const getRecipe = async (ctx) => {
  const recipeId = validateRecipeId(ctx.params.id);

  if (!recipeId) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Recipe ID must be a valid positive number'
    };
    return;
  }

  const recipe = await recipeModel.getRecipeById(recipeId);

  if (!recipe) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Recipe not found'
    };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    data: formatRecipeResponse(recipe)
  };
};

const createRecipe = async (ctx) => {
  const createdRecipe = await recipeModel.createRecipe(
    ctx.request.body,
    ctx.state.user.id
  );

  ctx.status = 201;
  ctx.body = {
    status: 'success',
    message: 'Recipe created successfully',
    data: formatRecipeResponse(createdRecipe)
  };
};

const updateRecipe = async (ctx) => {
  const recipeId = validateRecipeId(ctx.params.id);

  if (!recipeId) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Recipe ID must be a valid positive number'
    };
    return;
  }

  const existingRecipe = await recipeModel.getRecipeByIdForAdmin(recipeId);

  if (!existingRecipe) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Recipe not found'
    };
    return;
  }

  const updatedRecipe = await recipeModel.updateRecipe(recipeId, ctx.request.body);

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Recipe updated successfully',
    data: formatRecipeResponse(updatedRecipe)
  };
};

const deleteRecipe = async (ctx) => {
  const recipeId = validateRecipeId(ctx.params.id);

  if (!recipeId) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Recipe ID must be a valid positive number'
    };
    return;
  }

  const existingRecipe = await recipeModel.getRecipeByIdForAdmin(recipeId);

  if (!existingRecipe) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Recipe not found'
    };
    return;
  }

  await recipeModel.deleteRecipe(recipeId);

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Recipe deleted successfully'
  };
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
};