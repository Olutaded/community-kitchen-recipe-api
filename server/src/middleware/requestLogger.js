const requestLogger = async (ctx, next) => {
  const startTime = Date.now();

  await next();

  const responseTime = Date.now() - startTime;

  console.log(
    `${ctx.method} ${ctx.url} ${ctx.status} ${responseTime}ms`
  );
};

module.exports = requestLogger;