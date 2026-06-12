const Router = require('@koa/router');
const reviewController = require('../controllers/reviewController');
const { authenticate, requireScope } = require('../middleware/authMiddleware');
const { validateCreateReview } = require('../validation/reviewValidation');

const router = new Router({
  prefix: '/recipes'
});

router.get('/:id/reviews', reviewController.getReviews);

router.post(
  '/:id/reviews',
  authenticate,
  requireScope('reviews:write'),
  validateCreateReview,
  reviewController.createReview
);

module.exports = router;