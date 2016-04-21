'use strict';
let is = require('is_js');
let Errors = require('../../utils/error-codes');
let eventEmitter = require('../event-emitter');

module.exports = {
  path: '/users/session',
  method: 'post',
  actions: [
    async function verifyNameExist(ctx, next) {
      ctx.userEmail = ctx.request.body.user.email;
      ctx.userPassword = ctx.request.body.user.password;
      let userCount = await ctx.models.user.qCount({email: ctx.userEmail});
      if (userCount) return await next();
      ctx.sendErr(Errors.SigninEmailError);
    },

    async function getUser(ctx) {
      let user = await ctx.models.user.qOne({
        email: ctx.userEmail,
        password: ctx.userPassword
      });
      if (!user) return ctx.sendErr(Errors.SigninPasswordError);
      ctx.body = {user};
      ctx.session.userId = user.id;
      eventEmitter.emit('signin', user);
    }
  ]
};
