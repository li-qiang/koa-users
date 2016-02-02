'use strict'
let fs = require('fs');
let path = require('path');
let orm = require('orm');
let qOrm = require('q-orm');

let modelDir = path.join(__dirname, '..', 'models');
let syncDBdefer = Promise.defer();

let getConnection = () => {
  let testEnv = process.env.NODE_ENV == 'test';
  if (testEnv) {
    let dbPath = path.join(__dirname, '..', 'test', 'test.db');
    return `sqlite://${dbPath}`;
  }
  let db = require('./config').database;
  return `mysql://${db.username}:${db.password}@${db.host}/${db.database}`;
}

let loadModel = (db, file) => {
  let defer = Promise.defer()
  let filePath = path.join(modelDir, file);
  db.load(filePath, (err) => {
    if (err) throw err;
    defer.resolve();
  });
  return defer.promise;
}

let syncDB = (db) => {
  db.qSync()
    .then(() => syncDBdefer.resolve(db))
    .fail((err) => {
      throw err;
    });
}

let loadAllModel = (db) => {
  fs.readdir(modelDir, (err, files) => {
    if (err) throw err;
    let promises = files.filter((file) => /\.js/.test)
      .map((file) => loadModel(db, file));
    Promise.all(promises).then(() => syncDB(db));
  });
  return defer.promise;
}

qOrm.qConnect(getConnection()).then(loadAllModel);

module.exports = syncDBdefer.promise;
