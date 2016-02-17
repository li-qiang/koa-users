'use strict'
let koaBody = require('koa-body')();
let orm = require('orm');
let Errors = require('../../utils/error-codes');
let eventEmitter = require('../event-emitter');
let is = require('is_js');

module.exports = {
  path: '/users/:userId',
  method: 'put',
  actions: [
    function* AuthUser(next) {
      let hasAccess = this.session.userId == this.params.userId;
      if (hasAccess) return yield next;
      this.sendErr(Errors.NoAccess);
    },

    koaBody,

    function* varifyUsername(next) {
      this.user = this.request.body.user;
      if (this.user && is.present(this.user.name)) return yield next;
      this.sendErr(Errors.NameBlankWhenUpdateUser);
    },

    function* varifyUserEmail(next) {
      if (is.email(this.user.email)) return yield next;
      this.sendErr(Errors.EmailErrorWhenUpdateUser);
    },

    function* varifyUserPhone(next) {
      if (is.phoneNumber(this.user.phone)) return yield next;
      this.sendErr(Errors.PhoneErrorWhenUpdateUser);
    },

    function* verifyEmailExist(next) {
      let userCount = yield this.models.user.qCount({
        email: this.user.email,
        id: orm.ne(this.params.id)
      });
      if (!userCount) return yield next;
      this.sendErr(Errors.EmailErrorWhenUpdateUser);
    },

    function* createUser() {
      let user = yield this.models.user.qGet(this.params.userId);
      let updatedUser = yield user.qSave(this.user);
      this.body = {user: updatedUser};
      eventEmitter.emit('signup', user);
    }
  ]
}
