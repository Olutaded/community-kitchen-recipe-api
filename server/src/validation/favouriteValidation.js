const Joi = require('joi');

const createFavouriteSchema = Joi.object({
  recipeId: Joi.number().integer().positive().required()
});

const validateCreateFavourite = async (ctx, next) => {
  const { error, value } = createFavouriteSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Invalid favourite data',
      details: error.details.map((detail) => detail.message)
    };
    return;
  }

  ctx.request.body = value;
  await next();
};

module.exports = {
  validateCreateFavourite
};