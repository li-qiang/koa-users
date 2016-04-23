'use strict';
let path = require('path');
let loadDB = require(path.join(__dirname, '..', 'utils', 'load-db'));
let models;

loadDB.then((loadedDB) => models = loadedDB.models);

module.exports = () => {
    return async function (ctx, next) {
        ctx.models = models;
        await next();
    };
};
