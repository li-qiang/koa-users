'use strict'

let router = require('koa-router');

module.exports = class KoaUser {
  constructor() {

  }

  get callback() {
    return router.routes();
  }
}
