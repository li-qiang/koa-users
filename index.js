'use strict';

let Promise = require('bluebird');

let http = require('http');
let fs = require('fs');
let path = require('path');
let Koa = require('koa');
let router = require('./app/router');
let port = process.port || 8080;

let defer = Promise.defer();
const app = new Koa();


// Middlewares

var bodyParser = require('koa-bodyparser');
app.use(bodyParser());


// Initializers

let initializersDir = path.join(__dirname, 'initializers');
fs.readdirSync(initializersDir)
    .filter((file) => /\.js$/.test(file))
    .forEach((file) => {
        let filePath = path.join(initializersDir, file);
        let middleware = require(filePath);
        if (!middleware) return;
        app.use(middleware());
    });

app.use(router.routes());

let server = http.createServer(app.callback());

server.listen(port, () => {
    console.log(`Start Server At ${port}\n`);
    defer.resolve(server);
});

module.exports = defer.promise;
