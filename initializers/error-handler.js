'use strict'

module.exports = function* (next) {
  this.sendErr = (errCode) => {
    this.status = 401;
    this.body = {errCode}
  };
  yield next;
}
