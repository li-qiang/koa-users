'use strict';

module.exports = () => {
    return async function (cxt, next) {
        cxt.sendErr = (errmsg) => {
            cxt.status = 200;
            cxt.body = {error: 1, errorMsg: errmsg};
        };
        await next();
    }
};
