'use strict'
let path = require('path');
let loadDB = require(path.join(__dirname, '..', 'utils', 'load-db'));
let models;

loadDB.then((loadedDB) => models = loadedDB.models);

module.exports = function* (next) {
  this.models = models;
  yield next;
}
