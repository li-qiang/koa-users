'use strict'
let path = require('path');
let loadModels = require(path.join(__dirname, '..', 'utils', 'load-models'));
let models;

loadModels.then((loadedModels) => models = loadedModels);

module.exports = function* (next) {
  this.models = models;
  yield next;
}
