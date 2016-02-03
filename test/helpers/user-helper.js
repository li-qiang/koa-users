'use strict'
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let Const = require('../test-const');

module.exports.signupWith = (user) => {
  let agent = new Agent();
  let defer = Promise.defer();
  agent.post(`${Const.host}/users`)
    .send({user})
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}

module.exports.signinWith = (user) => {
  let defer = Promise.defer();
  let agent = new Agent();
  agent.post(`${Const.host}/users/session`)
    .send({user})
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}
