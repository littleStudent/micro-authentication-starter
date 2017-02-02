let mongoose = require('mongoose');

const { database, secret } = require('../config');
mongoose.Promise = global.Promise;
mongoose.connect(database);

module.exports = mongoose;
