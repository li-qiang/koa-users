'use strict'

let koaBody = require('koa-body')();

module.exports = {
  path: '/users',
  method: 'post',
  actions: [
    koaBody,
    function* setUser(next) {
      this.user = this.request.body;
      yield next;
    },
    function* varifyUsername() {
      this.body = yield this.models.user.qCreate(this.user);
    }
  ]
}
