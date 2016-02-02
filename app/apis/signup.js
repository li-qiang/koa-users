'use strict'

let koaBody = require('koa-body')();
let Errors = require('../../utils/error-codes');

module.exports = {
  path: '/users',
  method: 'post',
  actions: [
    koaBody,
    function* varifyUsername(next) {
      let user = this.request.body;
      let nameOk = user && user.name && user.name.length > 0;
      if (nameOk) return yield next;
      this.sendErr(Errors.SignupNameBlank);
    },

    function* coreateUser() {
      let user = this.request.body;
      this.body = yield this.models.user.qCreate(user);
    }
  ]
}
