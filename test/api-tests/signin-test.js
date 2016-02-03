'use strict'
let expect = require("chai").expect;
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let afterEachSync = syncHelper.afterEachSync;
let signinWith = require('../helpers/user-helper').signinWith;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');

describe("Signin User", () => {

  let res, user, models, db;
  beforeEachSync(function* () {
    db = yield loadDB;
    yield db.qExecQuery('delete from user;');
    models = db.models;
  });

  describe("When user exist", () => {

    beforeEachSync(function* () {
      user = {
        name: 'user',
        password: 'password'
      };
      yield models.user.qCreate(user);
      res = yield signinWith(user);
    });

    itShould('return user', function* () {
      expect(res.body.user).to.include(user);
    });

    itShould('set cookie', function* () {
      expect(res.headers['set-cookie']).to.be.ok;
    });
  });

  describe("When post data is error", () => {
    beforeEachSync(function* () {
      user = {
        email: 'test@test.com',
        password: 'password'
      };
    });

    itShould('return email error when email do not exist', function* () {
      res = yield signinWith(user);
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SigninEmailError);
    });

    itShould('return password error when password is error', function* () {
      yield models.user.qCreate(user);
      res = yield signinWith({email: user.email, password: 'errorPassword'});
      expect(res.status).to.equal(401);
      expect(res.body.errCode).to.equal(Errors.SigninPasswordError);
    });
  });

});
