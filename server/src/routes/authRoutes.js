const Router = require('@koa/router');
const authController = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

const router = new Router({
  prefix: '/auth'
});

router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.get('/admin-check', authenticate, authorizeRoles('admin'), authController.adminCheck);

module.exports = router;