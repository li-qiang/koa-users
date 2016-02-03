'use strict'
let koaBody = require('koa-body')();
let Errors = require('../../utils/error-codes');
let is = require('is_js');

module.exports = {
  path: '/users/session',
  method: 'post',
  actions: [
    koaBody,
    function* verifyNameExist(next) {
      this.userEmail = this.request.body.user.email;
      this.userPassword = this.request.body.user.password;
      let userCount = yield this.models.user.qCount({email: this.userEmail});
      if (userCount) return yield next;
      this.sendErr(Errors.SigninEmailError);
    },

    function* getUser() {
      let user = yield this.models.user.qOne({
        email: this.userEmail,
        password: this.userPassword
      });
      if (!user) return this.sendErr(Errors.SigninPasswordError);
      this.body = {user};
      this.session.userId = user.id;
    }
  ]
}
