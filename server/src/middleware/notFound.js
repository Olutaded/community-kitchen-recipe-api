const notFound = async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    status: 'error',
    message: 'Route not found'
  };
};

module.exports = notFound;