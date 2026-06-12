const Router = require('@koa/router');
const categoryController = require('../controllers/categoryController');

const router = new Router({
  prefix: '/categories'
});

router.get('/', categoryController.getCategories);

module.exports = router;