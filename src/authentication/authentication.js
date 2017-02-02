const { json, send, createError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
var mongoose = require('mongoose');
const assert = require('assert');

const { secret } = require('../config');
const User = require('../models/user');

/**
 * Catch errors from the wrapped function.
 * If any errors are catched, a JSON response is generated for that error.
 */
const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && err.stack) {
      console.error(err.stack);
    }

    send(res, err.statusCode || 500, { error: true, message: err.message });
  }
};

/**
 * Attempt to authenticate a user.
 */
const attempt = (username, password) => {
  return User.find({ username: username }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }

    const user = users[0];
    if (!compareSync(password, user.password)) {
      throw createError(401, 'Wrong password');
    }
    return user;
  });
};

/**
 * Authenticate a user and generate a JWT if successful.
 */
const auth = ({ username, password }) => {
  console.log(username);
  return attempt(username, password).then(({ id }) => {
    let token = sign(id, secret);
    return { token: token };
  });
};

const decode = token => {
  return verify(token, secret);
};

module.exports.login = handleErrors(
  async (req, res) => await auth(await json(req))
);

module.exports.decode = handleErrors(
  (req, res) => decode(req.headers['authorization'])
);
