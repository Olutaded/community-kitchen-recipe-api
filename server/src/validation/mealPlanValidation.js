const Joi = require('joi');

const createMealPlanSchema = Joi.object({
  recipeId: Joi.number().integer().positive().required(),
  mealDate: Joi.date().iso().required(),
  mealType: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snack').required(),
  notes: Joi.string().allow('', null).max(500)
});

const validateCreateMealPlan = async (ctx, next) => {
  const { error, value } = createMealPlanSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Invalid meal plan data',
      details: error.details.map((detail) => detail.message)
    };
    return;
  }

  ctx.request.body = value;
  await next();
};

module.exports = {
  validateCreateMealPlan
};