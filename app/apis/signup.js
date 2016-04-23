'use strict';
let Errors = require('../../utils/error-codes');
let eventEmitter = require('../event-emitter');
let is = require('is_js');

module.exports = {
    path: '/users',
    method: 'post',
    actions: [
        async function (ctx, next) {
            ctx.user = ctx.request.body.user;
            if (ctx.user && is.present(ctx.user.name)) return await next();
            ctx.sendErr(Errors.InvalidName);
        },

        async function (ctx, next) {
            if (is.present(ctx.user.password)) return await next();
            ctx.sendErr(Errors.InvalidPassword);
        },

        async function (ctx, next) {
            if (is.email(ctx.user.email)) return await next();
            ctx.sendErr(Errors.InvalidEmail);
        },

        async function (ctx, next) {
            if (is.phoneNumber(ctx.user.phone)) return await next();
            ctx.sendErr(Errors.InvalidPhone);
        },

        async function (ctx, next) {
            if (ctx.user.password === ctx.user.confirmPassword) return await next();
            ctx.sendErr(Errors.InvalidConfirmPassword);
        },

        async function (ctx, next) {
            let userCount = await ctx.models.user.qCount({email: ctx.user.email});
            if (!userCount) return await next();
            ctx.sendErr(Errors.EmailExist);
        },

        async function (ctx) {
            let user = await ctx.models.user.qCreate(ctx.user);
            ctx.body = {user};
            eventEmitter.emit('signup', user);
        }
    ]
};
