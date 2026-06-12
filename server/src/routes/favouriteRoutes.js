const Router = require('@koa/router');
const favouriteController = require('../controllers/favouriteController');
const { authenticate, requireScope } = require('../middleware/authMiddleware');
const { validateCreateFavourite } = require('../validation/favouriteValidation');

const router = new Router({
  prefix: '/favourites'
});

router.get(
  '/',
  authenticate,
  favouriteController.getFavourites
);

router.post(
  '/',
  authenticate,
  requireScope('favourites:write'),
  validateCreateFavourite,
  favouriteController.createFavourite
);

router.delete(
  '/:recipeId',
  authenticate,
  requireScope('favourites:write'),
  favouriteController.deleteFavourite
);

module.exports = router;