const Router = require('@koa/router');
const ingredientController = require('../controllers/ingredientController');

const router = new Router({
  prefix: '/ingredients'
});

router.get('/', ingredientController.getIngredients);

module.exports = router;