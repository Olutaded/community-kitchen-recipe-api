const cacheControl = async (ctx, next) => {
  await next();

  if (ctx.method === 'GET' && ctx.status === 200) {
    ctx.set('Cache-Control', 'public, max-age=60');
    return;
  }

  ctx.set('Cache-Control', 'no-store');
};

module.exports = cacheControl;