'use strict';
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let Const = require('../test-const');
let Promise = require('bluebird');
let request = (method, url, data, agent) => {
  agent = agent || Agent();
  let defer = Promise.defer();
  agent[method](url)
      .send({user: data})
      .end((err, res) => {
        defer.resolve(res);
      });
  return defer.promise;
};

let helpers = {
  signupWith(user, agent) {
    return request('post', `${Const.host}/users`, user, agent);
  },

  signinWith(user, agent) {
    return request('post', `${Const.host}/users/session`, user, agent);
  },

  initAndSignin(user, agent) {
    let defer = Promise.defer();
    helpers.signupWith(user, agent).then((res) => {
      let registerUser = res.body.user;
      helpers.signinWith({
        email: registerUser.email,
        password: registerUser.password
      }, agent).then((res) => defer.resolve(registerUser));
    });
    return defer.promise;
  },

  update(userId, user, agent) {
    return request('put', `${Const.host}/users/${userId}`, user, agent);
  }
};

module.exports = helpers;
