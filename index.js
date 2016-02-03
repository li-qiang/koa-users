'use strict'

let http = require('http');
let fs = require('fs');
let path = require('path');
let koa = require('koa');
let router = require('./app/router');
let port = process.port || 8080;
let defer = Promise.defer();
let app = koa();


let initializersDir = path.join(__dirname, 'initializers');
fs.readdirSync(initializersDir)
  .filter((file) => /\.js$/.test(file))
  .forEach((file) => {
    let filePath = path.join(initializersDir, file);
    let middleware = require(filePath);
    if (!middleware) return;
    let isGenerator = middleware.constructor.name == 'GeneratorFunction';
    isGenerator ? router.use(middleware) : middleware(app);
  });

app.use(router.routes());

let server = http.createServer(app.callback());

server.listen(port, () => {
  console.log(`Start Server At ${port}\n`);
  defer.resolve(server);
});

module.exports = defer.promise;
