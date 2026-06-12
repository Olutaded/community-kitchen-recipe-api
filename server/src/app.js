const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');

const { testConnection } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');

const requestLogger = require('./middleware/requestLogger');
const responseTime = require('./middleware/responseTime');
const cacheControl = require('./middleware/cacheControl');
const notFound = require('./middleware/notFound');

const app = new Koa();

const router = new Router({
  prefix: '/api'
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);

    ctx.status = error.status || 500;
    ctx.body = {
      status: 'error',
      message: 'Internal server error'
    };
  }
});

app.use(responseTime);
app.use(requestLogger);
app.use(helmet());
app.use(cors());
app.use(bodyParser());
app.use(cacheControl);

router.get('/health', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Community Kitchen Recipe API is running'
  };
});

router.get('/db-test', async (ctx) => {
  await testConnection();

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Database connection is working'
  };
});

router.use(authRoutes.routes());
router.use(authRoutes.allowedMethods());

router.use(recipeRoutes.routes());
router.use(recipeRoutes.allowedMethods());

router.use(categoryRoutes.routes());
router.use(categoryRoutes.allowedMethods());

router.use(ingredientRoutes.routes());
router.use(ingredientRoutes.allowedMethods());

router.use(mealPlanRoutes.routes());
router.use(mealPlanRoutes.allowedMethods());

router.use(reviewRoutes.routes());
router.use(reviewRoutes.allowedMethods());

router.use(favouriteRoutes.routes());
router.use(favouriteRoutes.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(notFound);

module.exports = app;