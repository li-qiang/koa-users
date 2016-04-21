'use strict';

module.exports = () => {
    return async function (cxt, next) {
        cxt.sendErr = (errCode) => {
            cxt.status = 401;
            cxt.body = {errCode}
        };
        await next();
    }
};
