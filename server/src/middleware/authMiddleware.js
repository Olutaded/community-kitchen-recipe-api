const jwt = require('jsonwebtoken');

const authenticate = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: 'Authentication token is required'
    };
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: 'Authorization header must use the Bearer scheme'
    };
    return;
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decodedUser;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: 'Invalid or expired authentication token'
    };
  }
};

const authorizeRoles = (...allowedRoles) => {
  return async (ctx, next) => {
    const user = ctx.state.user;

    if (!user || !allowedRoles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'You do not have permission to access this resource'
      };
      return;
    }

    await next();
  };
};

const requireScope = (requiredScope) => {
  return async (ctx, next) => {
    const user = ctx.state.user;

    if (!user || !Array.isArray(user.scopes) || !user.scopes.includes(requiredScope)) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: `Missing required scope: ${requiredScope}`
      };
      return;
    }

    await next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
  requireScope
};