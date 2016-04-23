'use strict';

let fs = require('fs');
let Const = require('./test-const');

process.port = Const.appPort;
process.env.NODE_ENV = Const.env;


let startServer = require('../index');
let loadDB = require('../utils/load-db');
let gRunner = require('./helpers/g-runner');

let bluebird = require('bluebird');

let removeTestDB = () => {
    let defer = bluebird.defer();
    fs.unlink(Const.dbPath, () => defer.resolve());
    return defer.promise;
};

before(gRunner(function *() {
    yield startServer;
}));

after(gRunner(function *() {
    let db = yield loadDB;
    db.close();
    yield removeTestDB();
}));
