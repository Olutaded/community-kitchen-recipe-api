const ingredientModel = require('../models/ingredientModel');

const getIngredients = async (ctx) => {
  const ingredients = await ingredientModel.getAllIngredients();

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    count: ingredients.length,
    data: ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      unit: ingredient.unit,
      createdAt: ingredient.created_at,
      updatedAt: ingredient.updated_at,
      links: {
        self: `/api/ingredients/${ingredient.id}`
      }
    }))
  };
};

module.exports = {
  getIngredients
};