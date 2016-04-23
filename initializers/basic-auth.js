"use strict";
let auth = require('basic-auth');
let Errors = require('../utils/error-codes');


module.exports = () => {
    return async function (ctx, next) {
        let user = auth(ctx.req);
        if (user) {
            ctx.currentUser = await ctx.models.user.qOne({email: user.name, password: user.pass});
            if (!ctx.currentUser) return ctx.sendErr(Errors.InvalidUser);
        }
        await next();
    };
};