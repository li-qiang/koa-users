'use strict'
let expect = require("chai").expect;
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let afterEachSync = syncHelper.afterEachSync;
let signupWith = require('../helpers/user-helper').signupWith;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');

describe("Signup User", () => {

  let res, user, models, db;
  beforeEachSync(function* () {
    db = yield loadDB;
    yield db.qExecQuery('delete from user;');
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
      expect(res.body.user.name).to.equal(user.name);
      expect(res.body.user.email).to.equal(user.email);
      expect(res.body.user.phone).to.equal(user.phone);
    });

    itShould('create a user in database', function* () {
      let foundUser = yield models.user.qOne({
        email: user.email
      });
      expect(foundUser.id).to.be.a('number');
      expect(foundUser.name).to.equal(user.name);
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

    itShould('return error code when user name is null', function* () {
      user.name = null;
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupNameBlank);
    });

    itShould('return error code when user password is null', function* () {
      user.password = null;
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupPasswordBlank);
    });

    itShould('return error code when user email is error', function* () {
      user.email = '';
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupEmailError);
    });

    itShould('return error code when user phone is error', function* () {
      user.phone = '11';
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupPhoneError);
    });

    itShould('return error code when user confirmPassword is diffrent with password', function* () {
      user.confirmPassword = 'aaaa';
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupPasswordDiff);
    });

    itShould('return error code when user name exist', function* () {
      yield signupWith(user);
      res = yield signupWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SignupNameExist);
    });

  });
});
