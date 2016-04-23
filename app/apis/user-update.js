'use strict'

let orm = require('orm');
let Errors = require('../../utils/error-codes');
let eventEmitter = require('../event-emitter');
let is = require('is_js');

module.exports = {
    path: '/users/:userId',
    method: 'put',
    actions: [
        async function (ctx, next) {
            if(ctx.currentUser) return await next();
            ctx.sendErr(Errors.NoAccess);
        },

        async function (ctx, next) {
            let hasAccess = ctx.currentUser.id == ctx.params.userId;
            if (hasAccess) return await next();
            ctx.sendErr(Errors.NoAccess);
        },

        async function (ctx, next) {
            ctx.user = ctx.request.body.user;
            if (ctx.user && is.present(ctx.user.name)) return await next();
            ctx.sendErr(Errors.InvalidName);
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
            let userCount = await ctx.models.user.qCount({
                email: ctx.user.email,
                id: orm.ne(ctx.params.id)
            });
            if (!userCount) return await next();
            ctx.sendErr(Errors.EmailExist);
        },

        async function (ctx) {
            let user = await ctx.models.user.qGet(ctx.params.userId);
            let updatedUser = await user.qSave(ctx.user);
            ctx.body = {user: updatedUser};
            eventEmitter.emit('signup', user);
        }
    ]
};
