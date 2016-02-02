'use strict'
let expect = require("chai").expect;
let Agent = require('superagent').agent;
let agent = new Agent();
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let app = require('../test-helper');
let loadDB = require('../../utils/load-db');

describe("Signup User", () => {

  let signupWith = (data) => {
    let defer = Promise.defer();
    agent.post(`${app.domain}/users`)
      .send(data)
      .end((err, res) => {
        expect(err).to.not.ok;
        defer.resolve(res);
      });
    return defer.promise;
  }

  describe("When post data is ok", () => {
    let res, models, user = {
      name: 'user',
      password: 'password',
      confirmPassword: 'password',
      email: 'test@test.com',
      phone: '12345678901'
    };

    beforeEachSync(function* () {
      res = yield signupWith(user);
      let database = yield loadDB;
      models = database.models;
    });

    itShould("response with a user when post data is ok", function* () {
      expect(res.body.name).to.equal(user.name);
      expect(res.body.email).to.equal(user.email);
      expect(res.body.phone).to.equal(user.phone);
    });

    itShould('create a user in database', function* () {
      let foundUser = yield models.user.qOne({
        email: user.email
      });
      expect(foundUser.id).to.be.a('number');
    })

  });
});
