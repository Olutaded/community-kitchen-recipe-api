const Router = require('@koa/router');
const recipeController = require('../controllers/recipeController');
const { authenticate, authorizeRoles, requireScope } = require('../middleware/authMiddleware');
const { validateCreateRecipe, validateUpdateRecipe } = require('../validation/recipeValidation');

const router = new Router({
  prefix: '/recipes'
});

router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipe);

router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  requireScope('recipes:write'),
  validateCreateRecipe,
  recipeController.createRecipe
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  requireScope('recipes:write'),
  validateUpdateRecipe,
  recipeController.updateRecipe
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  requireScope('recipes:write'),
  recipeController.deleteRecipe
);

module.exports = router;