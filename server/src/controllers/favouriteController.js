const favouriteModel = require('../models/favouriteModel');

const formatFavouriteResponse = (favourite) => ({
  id: favourite.id,
  userId: favourite.user_id,
  recipeId: favourite.recipe_id,
  recipeTitle: favourite.recipe_title,
  recipeDescription: favourite.recipe_description,
  category: favourite.category_name,
  difficulty: favourite.difficulty,
  servings: favourite.servings,
  createdAt: favourite.created_at,
  links: {
    self: `/api/favourites/${favourite.recipe_id}`,
    recipe: `/api/recipes/${favourite.recipe_id}`
  }
});

const validateRecipeId = (id) => {
  const recipeId = Number(id);
  return Number.isInteger(recipeId) && recipeId > 0 ? recipeId : null;
};

const getFavourites = async (ctx) => {
  const userId = ctx.state.user.id;

  const favourites = await favouriteModel.getFavouritesByUserId(userId);

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    count: favourites.length,
    data: favourites.map(formatFavouriteResponse)
  };
};

const createFavourite = async (ctx) => {
  const userId = ctx.state.user.id;
  const { recipeId } = ctx.request.body;

  const exists = await favouriteModel.recipeExists(recipeId);

  if (!exists) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Recipe not found'
    };
    return;
  }

  const alreadyFavourite = await favouriteModel.favouriteExists(userId, recipeId);

  if (alreadyFavourite) {
    ctx.status = 409;
    ctx.body = {
      status: 'error',
      message: 'Recipe is already in favourites'
    };
    return;
  }

  const createdFavourite = await favouriteModel.createFavourite(userId, recipeId);

  ctx.status = 201;
  ctx.body = {
    status: 'success',
    message: 'Favourite added successfully',
    data: formatFavouriteResponse(createdFavourite)
  };
};

const deleteFavourite = async (ctx) => {
  const userId = ctx.state.user.id;
  const recipeId = validateRecipeId(ctx.params.recipeId);

  if (!recipeId) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Recipe ID must be a valid positive number'
    };
    return;
  }

  const deleted = await favouriteModel.deleteFavourite(userId, recipeId);

  if (!deleted) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Favourite not found'
    };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Favourite removed successfully'
  };
};

module.exports = {
  getFavourites,
  createFavourite,
  deleteFavourite
};