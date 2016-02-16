'use strict'
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let Const = require('../test-const');

let request = (method, url, data, agent) => {
  agent = agent || new Agent();
  let defer = Promise.defer();
  agent[method](url)
    .send({user: data})
    .end((err, res) => {
      defer.resolve(res);
    });
  return defer.promise;
}

module.exports = {
  signupWith(user, agent) {
    return request('post', `${Const.host}/users`, user, agent);
  },

  signinWith(user, agent) {
    return request('post', `${Const.host}/users/session`, user, agent);
  },

  update(userId, user, agent) {
    return request('put', `${Const.host}/users/${userId}`, user, agent);
  }
}
