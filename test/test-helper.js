'use strict';

process.port = 4321;

let startServer = require('../index');

before((done) => {
  startServer.then(() => done());
});

let loadDir = require('./helpers/load-dir');

loadDir(__dirname);

module.exports.domain = `http://127.0.0.1:${process.port}`;
