const Router = require('@koa/router');
const mealPlanController = require('../controllers/mealPlanController');
const { authenticate, requireScope } = require('../middleware/authMiddleware');
const { validateCreateMealPlan } = require('../validation/mealPlanValidation');

const router = new Router({
  prefix: '/meal-plans'
});

router.get(
  '/',
  authenticate,
  mealPlanController.getMealPlans
);

router.post(
  '/',
  authenticate,
  requireScope('mealplans:write'),
  validateCreateMealPlan,
  mealPlanController.createMealPlan
);

module.exports = router;