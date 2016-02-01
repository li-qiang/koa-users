'use strict'
let fs = require('fs');
let path = require('path');
var orm = require("orm");
let qOrm = require('q-orm');

let database = 'koaServer';
let username = 'root';
let password = '123qwe';
let host = 'localhost';
let modelDir = path.join(__dirname, '..', 'models');

let syncDBdefer = Promise.defer();
let connection;

if (process.env.NODE_ENV == 'test') {
  let dbPath = path.join(__dirname, '..', 'test','test.db');
  connection = qOrm.qConnect(`sqlite://${dbPath}`);
} else {
  connection = qOrm.qConnect(`mysql://${username}:${password}@${host}/${database}`)
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
    .then(() => syncDBdefer.resolve(db.models))
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

connection.then(loadAllModel);

console.log(process.env.NODE_ENV);

module.exports = syncDBdefer.promise;
