'use strict'
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let Const = require('../test-const');

let post = (url, data, agent) => {
  agent = agent || new Agent();
  let defer = Promise.defer();
  agent.post(url)
    .send({user: data})
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}

module.exports.signupWith = (user, agent) => {
  return post(`${Const.host}/users`, user, agent);
}

module.exports.signinWith = (user, agent) => {
  return post(`${Const.host}/users/session`, user, agent);
}
