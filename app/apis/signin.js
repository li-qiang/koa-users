'use strict';

let Errors = require('../../utils/error-codes');
let eventEmitter = require('../event-emitter');

module.exports = {
    path: '/users/session',
    method: 'post',
    actions: [
        async function (ctx, next) {
            if(ctx.currentUser) return await next();
            ctx.sendErr(Errors.InvalidUser);
        },

        async function (ctx) {
            let user = await ctx.models.user.qOne({
                email: ctx.currentUser.email,
                password: ctx.currentUser.password
            });
            if (!user) return ctx.sendErr(Errors.InvalidUser);
            ctx.body = {user};
            eventEmitter.emit('signin', user);
        }
    ]
};
