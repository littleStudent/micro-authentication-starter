const User = require('../models/user');

module.exports.list = async () => {
  return await User.find();
};
