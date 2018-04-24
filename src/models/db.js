let mongoose = require('mongoose');

const { database, secret } = require('../config');
mongoose.Promise = global.Promise;
const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
mongoose.connect(database, options);

module.exports = mongoose;
