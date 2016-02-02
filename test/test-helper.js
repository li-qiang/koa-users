'use strict';

let fs = require('fs');
let path = require('path');

process.port = 4321;
process.env.NODE_ENV = 'test';

let startServer = require('../index');

before((done) => {
  startServer.then(() => done());
});

let loadDir = require('./helpers/load-dir');

loadDir(__dirname);

let loadDB = require('../utils/load-db');

after((done) => {
  loadDB.then((db) => {
    db.close();
    let dbFile = path.join(__dirname, 'test.db');
    fs.unlink(dbFile, done);
  });
});

module.exports.domain = `http://127.0.0.1:${process.port}`;
