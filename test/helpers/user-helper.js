'use strict'
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let Const = require('../test-const');

module.exports.signupWith = (user, agent) => {
  agent = agent || new Agent();
  let defer = Promise.defer();
  agent.post(`${Const.host}/users`)
    .send({user})
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}

module.exports.signinWith = (user, agent) => {
  agent = agent || new Agent();
  let defer = Promise.defer();
  agent.post(`${Const.host}/users/session`)
    .send({user})
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}
