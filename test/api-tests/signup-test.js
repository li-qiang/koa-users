'use strict'
let expect = require("chai").expect;
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let signupWith = require('../helpers/user-helper').signupWith;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');

describe("Signup User", () => {

  let res, user, models;
  beforeEachSync(function* () {
    let db = yield loadDB;
    models = db.models;
  });

  describe("When post data is ok", () => {
    beforeEachSync(function* () {
      user = {
        name: 'user',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        phone: '12345678901'
      };
      res = yield signupWith(user);
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

  describe("When post data is error", () => {
    beforeEachSync(function* () {
      user = {
        name: 'user',
        password: 'password',
        confirmPassword: 'password',
        email: 'test@test.com',
        phone: '12345678901'
      };
    });

    itShould('return error code 10001 when user name is null', function* () {
      user.name = null;
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupNameBlank);
    });


  });
});
