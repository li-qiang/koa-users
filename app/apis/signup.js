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
      this.user = this.request.body.user;
      if (this.user && is.present(this.user.name)) return yield next;
      this.sendErr(Errors.SignupNameBlank);
    },

    function* varifyUserPassword(next) {
      if (is.present(this.user.password)) return yield next;
      this.sendErr(Errors.SignupPasswordBlank);
    },

    function* varifyUserEmail(next) {
      if (is.email(this.user.email)) return yield next;
      this.sendErr(Errors.SignupEmailError);
    },

    function* varifyUserPhone(next) {
      if (is.phoneNumber(this.user.phone)) return yield next;
      this.sendErr(Errors.SignupPhoneError);
    },

    function* verifyPasswordSame(next) {
      if (this.user.password === this.user.confirmPassword) return yield next;
      this.sendErr(Errors.SignupPasswordDiff);
    },

    function* verifyEmailExist(next) {
      let userCount = yield this.models.user.qCount({email: this.user.email});
      if (!userCount) return yield next;
      this.sendErr(Errors.SignupEmailExist);
    },

    function* createUser() {
      let user = yield this.models.user.qCreate(this.user);
      this.body = {user};
    }
  ]
}
