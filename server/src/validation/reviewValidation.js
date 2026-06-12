const Joi = require('joi');

const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null).max(500)
});

const validateCreateReview = async (ctx, next) => {
  const { error, value } = createReviewSchema.validate(ctx.request.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Invalid review data',
      details: error.details.map((detail) => detail.message)
    };
    return;
  }

  ctx.request.body = value;
  await next();
};

module.exports = {
  validateCreateReview
};