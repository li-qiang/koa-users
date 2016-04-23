'use strict';

let fs = require('fs');
let Const = require('./test-const');
process.port = Const.appPort;
process.env.NODE_ENV = Const.env;

let startServer = require('../index');
let loadDB = require('../utils/load-db');

before((done) => {
    startServer.then(() => done());
});

after((done) => {
    loadDB.then((db) => {
        db.close();
        fs.unlink(Const.dbPath, () => done());
    });
});