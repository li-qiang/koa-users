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

    function* verifyPasswordSame(next) {
      let user = this.request.body;
      if (user && user.password === user.confirmPassword) return yield next;
      this.sendErr(Errors.SignupPasswordDiff);
    },

    function* verifyNameExist(next) {
      let user = this.request.body;
      let userCount = yield this.models.user.qCount({name: user.name});
      if (!userCount) return yield next;
      this.sendErr(Errors.SignupNameExist);
    },

    function* createUser() {
      let user = this.request.body;
      this.body = yield this.models.user.qCreate(user);
    }
  ]
}
