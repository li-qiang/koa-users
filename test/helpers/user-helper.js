'use strict'
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let agent = new Agent();
let Const = require('../test-const');

module.exports.signupWith = (data) => {
  let defer = Promise.defer();
  agent.post(`${Const.host}/users`)
    .send(data)
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}
