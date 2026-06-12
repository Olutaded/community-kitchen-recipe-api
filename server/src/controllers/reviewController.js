const reviewModel = require('../models/reviewModel');

const validateRecipeId = (id) => {
  const recipeId = Number(id);
  return Number.isInteger(recipeId) && recipeId > 0 ? recipeId : null;
};

const formatReviewResponse = (review) => ({
  id: review.id,
  userId: review.user_id,
  recipeId: review.recipe_id,
  rating: review.rating,
  comment: review.comment,
  reviewerName: review.reviewer_name,
  createdAt: review.created_at,
  updatedAt: review.updated_at,
  links: {
    self: `/api/recipes/${review.recipe_id}/reviews`,
    recipe: `/api/recipes/${review.recipe_id}`
  }
});

const getReviews = async (ctx) => {
  const recipeId = validateRecipeId(ctx.params.id);

  if (!recipeId) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Recipe ID must be a valid positive number'
    };
    return;
  }

  const exists = await reviewModel.recipeExists(recipeId);

  if (!exists) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Recipe not found'
    };
    return;
  }

  const reviews = await reviewModel.getReviewsByRecipeId(recipeId);

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    count: reviews.length,
    data: reviews.map(formatReviewResponse)
  };
};

const createReview = async (ctx) => {
  const recipeId = validateRecipeId(ctx.params.id);
  const userId = ctx.state.user.id;

  if (!recipeId) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Recipe ID must be a valid positive number'
    };
    return;
  }

  const exists = await reviewModel.recipeExists(recipeId);

  if (!exists) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Recipe not found'
    };
    return;
  }

  const alreadyReviewed = await reviewModel.userReviewExists(userId, recipeId);

  if (alreadyReviewed) {
    ctx.status = 409;
    ctx.body = {
      status: 'error',
      message: 'You have already reviewed this recipe'
    };
    return;
  }

  const createdReview = await reviewModel.createReview(
    userId,
    recipeId,
    ctx.request.body
  );

  ctx.status = 201;
  ctx.body = {
    status: 'success',
    message: 'Review created successfully',
    data: formatReviewResponse(createdReview)
  };
};

module.exports = {
  getReviews,
  createReview
};