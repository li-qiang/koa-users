'use strict'

let koaBody = require('koa-body')();
let Errors = require('../../utils/error-codes');
let is = require('is_js');

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

    function* varifyUserEmail(next) {
      let user = this.request.body;
      if (user && is.email(user.email)) return yield next;
      this.sendErr(Errors.SignupEmailError);
    },

    function* varifyUserPhone(next) {
      let user = this.request.body;
      if (user && is.phoneNumber(user.phone)) return yield next;
      this.sendErr(Errors.SignupPhoneError);
    },

    function* createUser() {
      let user = this.request.body;
      this.body = yield this.models.user.qCreate(user);
    }
  ]
}
