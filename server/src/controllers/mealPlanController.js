const mealPlanModel = require('../models/mealPlanModel');

const formatMealPlanResponse = (mealPlan) => ({
  id: mealPlan.id,
  userId: mealPlan.user_id,
  recipeId: mealPlan.recipe_id,
  recipeTitle: mealPlan.recipe_title,
  category: mealPlan.category_name,
  mealDate: mealPlan.meal_date,
  mealType: mealPlan.meal_type,
  notes: mealPlan.notes,
  createdAt: mealPlan.created_at,
  updatedAt: mealPlan.updated_at,
  links: {
    self: `/api/meal-plans/${mealPlan.id}`,
    recipe: `/api/recipes/${mealPlan.recipe_id}`
  }
});

const getMealPlans = async (ctx) => {
  const userId = ctx.state.user.id;

  const mealPlans = await mealPlanModel.getMealPlansByUserId(userId);

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    count: mealPlans.length,
    data: mealPlans.map(formatMealPlanResponse)
  };
};

const createMealPlan = async (ctx) => {
  const userId = ctx.state.user.id;

  const createdMealPlan = await mealPlanModel.createMealPlan(
    userId,
    ctx.request.body
  );

  ctx.status = 201;
  ctx.body = {
    status: 'success',
    message: 'Meal plan created successfully',
    data: formatMealPlanResponse(createdMealPlan)
  };
};

module.exports = {
  getMealPlans,
  createMealPlan
};