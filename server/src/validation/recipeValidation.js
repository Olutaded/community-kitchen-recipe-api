const Joi = require('joi');

const recipeSchema = Joi.object({
  categoryId: Joi.number().integer().positive().required(),
  title: Joi.string().min(3).max(150).required(),
  description: Joi.string().min(10).required(),
  instructions: Joi.string().min(10).required(),
  preparationTimeMinutes: Joi.number().integer().min(1).required(),
  cookingTimeMinutes: Joi.number().integer().min(1).required(),
  servings: Joi.number().integer().min(1).required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  isPublic: Joi.boolean().default(true)
});

const validateCreateRecipe = async (ctx, next) => {
  const { error, value } = recipeSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Invalid recipe data',
      details: error.details.map((detail) => detail.message)
    };
    return;
  }

  ctx.request.body = value;
  await next();
};

const validateUpdateRecipe = async (ctx, next) => {
  const { error, value } = recipeSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Invalid recipe data',
      details: error.details.map((detail) => detail.message)
    };
    return;
  }

  ctx.request.body = value;
  await next();
};

module.exports = {
  validateCreateRecipe,
  validateUpdateRecipe
};