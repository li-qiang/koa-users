'use strict'
let expect = require("chai").expect;
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let signupWith = require('../helpers/user-helper').signupWith;
let loadDB = require('../../utils/load-db');

describe("Signup User", () => {

  describe("When post data is ok", () => {
    let res, models, user;
    beforeEachSync(function* () {
      user = {
        name: 'user',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        phone: '12345678901'
      };
      res = yield signupWith(user);
      let db = yield loadDB;
      models = db.models;
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
    });

  });
});
