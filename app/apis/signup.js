'use strict';
let Errors = require('../../utils/error-codes');
let eventEmitter = require('../event-emitter');
let is = require('is_js');

module.exports = {
    path: '/users',
    method: 'post',
    actions: [
        async function varifyUsername(ctx, next) {
            ctx.user = ctx.request.body.user;
            if (ctx.user && is.present(ctx.user.name)) return await next();
            ctx.sendErr(Errors.SignupNameBlank);
        },

        async function varifyUserPassword(ctx, next) {
            if (is.present(ctx.user.password)) return await next();
            ctx.sendErr(Errors.SignupPasswordBlank);
        },

        async function varifyUserEmail(ctx, next) {
            if (is.email(ctx.user.email)) return await next();
            ctx.sendErr(Errors.SignupEmailError);
        },

        async function varifyUserPhone(ctx, next) {
            if (is.phoneNumber(ctx.user.phone)) return await next();
            ctx.sendErr(Errors.SignupPhoneError);
        },

        async function verifyPasswordSame(ctx, next) {
            if (ctx.user.password === ctx.user.confirmPassword) return await next();
            ctx.sendErr(Errors.SignupPasswordDiff);
        },

        async function verifyEmailExist(ctx, next) {
            let userCount = await ctx.models.user.qCount({email: ctx.user.email});
            if (!userCount) return await next();
            ctx.sendErr(Errors.SignupEmailExist);
        },

        async function createUser(ctx) {
            let user = await ctx.models.user.qCreate(ctx.user);
            ctx.body = {user};
            eventEmitter.emit('signup', user);
        }
    ]
};
