'use strict'
var session = require('koa-session');

module.exports = (app) => {
  app.keys = ['SecurityKey'];
  app.use(session(app));
}
