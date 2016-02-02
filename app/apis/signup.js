'use strict'

let koaBody = require('koa-body')();
let Errors = require('../../utils/error-codes');
let is = require('../../utils/is');

module.exports = {
  path: '/users',
  method: 'post',
  actions: [
    koaBody,
    function* varifyUsername(next) {
      let user = this.request.body;
      if (user && is.present(user.name)) return yield next;
      this.sendErr(Errors.SignupNameBlank);
    },

    function* varifyUserPassword(next) {
      let user = this.request.body;
      if (user && is.present(user.password)) return yield next;
      this.sendErr(Errors.SignupPasswordBlank);
    },

    function* coreateUser() {
      let user = this.request.body;
      this.body = yield this.models.user.qCreate(user);
    }
  ]
}
