'use strict';

let fs = require('fs');
let path = require('path');
let apiPath = path.join(__dirname, 'apis');
let apiFiles = fs.readdirSync(apiPath);
let Router = require('koa-router');
let router = new Router();

apiFiles.forEach((file) => {
  let api = require(path.join(apiPath, file));
  let args = [api.path].concat(api.actions);
  router[api.method](...args);
});

module.exports = router;
