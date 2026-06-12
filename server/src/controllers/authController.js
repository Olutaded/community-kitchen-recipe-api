const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const login = async (ctx) => {
  const { email, password } = ctx.request.body || {};

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Email and password are required'
    };
    return;
  }

  const user = await authModel.findUserByEmail(email);

  if (!user) {
    await authModel.createSecurityLog(
      null,
      'LOGIN_FAILED',
      ctx.ip,
      `Failed login attempt for email: ${email}`
    );

    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: 'Invalid email or password'
    };
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    await authModel.createSecurityLog(
      user.id,
      'LOGIN_FAILED',
      ctx.ip,
      `Failed login attempt for user ID: ${user.id}`
    );

    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: 'Invalid email or password'
    };
    return;
  }

  const scopes = user.scopes.split(',').map((scope) => scope.trim());

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      scopes
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  );

  await authModel.createSecurityLog(
    user.id,
    'LOGIN_SUCCESS',
    ctx.ip,
    `Successful login for user ID: ${user.id}`
  );

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      scopes
    }
  };
};

const getProfile = async (ctx) => {
  const user = ctx.state.user;

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      scopes: user.scopes
    }
  };
};

const adminCheck = async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Admin authorisation successful',
    data: {
      user: ctx.state.user.email,
      role: ctx.state.user.role
    }
  };
};

module.exports = {
  login,
  getProfile,
  adminCheck
};