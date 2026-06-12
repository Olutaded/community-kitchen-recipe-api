const responseTime = async (ctx, next) => {
  const startTime = Date.now();

  await next();

  const duration = Date.now() - startTime;
  ctx.set('X-Response-Time', `${duration}ms`);
};

module.exports = responseTime;