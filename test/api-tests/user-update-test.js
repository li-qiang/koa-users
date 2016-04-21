'use strict';
let expect = require("chai").expect;
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let afterEachSync = syncHelper.afterEachSync;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');
let userHelper = require('../helpers/user-helper');
let superAgent = require('superagent');

describe("User Update", () => {

  let res, user, models, db, agent,
    preparedUser = {
      name: 'user',
      password: 'password',
      confirmPassword: 'password',
      email: 'test@test.com',
      phone: '12345678901'
    };

  beforeEachSync(function* () {
    agent = superAgent.agent();
    db = yield loadDB;
    yield db.qExecQuery('delete from user;');
    models = db.models;
  });

  describe("When post data is ok", () => {
    let updatedName = 'updatedUserName',
      updatedEmail = 'updatedUserEmail@163.com',
      updatedPhone = '12332112312';

    beforeEachSync(function* () {
      user = yield userHelper.initAndSignin(preparedUser, agent);
      res = yield userHelper.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
      }, agent);
    });

    itShould("response with a user", function* () {
      expect(res.status).to.equal(200);
      expect(res.body.user.name).to.equal(updatedName);
      expect(res.body.user.email).to.equal(updatedEmail);
      expect(res.body.user.phone).to.equal(updatedPhone);
    });

    itShould('update user in database', function* () {
      let savedUser = yield models.user.qGet(user.id);
      expect(savedUser).to.be.ok;
      expect(savedUser.name).to.equal(updatedName);
      expect(savedUser.phone).to.equal(updatedPhone);
    });
  });

  describe('When not signin', () => {
    itShould('response no access', function* () {
      let signupRes = yield userHelper.signupWith(preparedUser, agent);
      user = signupRes.body.user;
      res = yield userHelper.update(user.id, {});
      expect(res.body.errCode).to.equal(Errors.NoAccess);
    });
  });

  describe("When email is error", () => {
    let updatedName = 'updatedUserName',
      updatedEmail = 'updatedUserEmail',
      updatedPhone = '12332112312';

    itShould("response email error", function* () {
      user = yield userHelper.initAndSignin(preparedUser, agent);
      res = yield userHelper.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
      }, agent);
      expect(res.body.errCode).to.equal(Errors.EmailErrorWhenUpdateUser);
    });
  });

  describe("When name is blank", () => {
    let updatedName = '',
      updatedEmail = 'updatedUserEmail@163.com',
      updatedPhone = '12332112312';

    itShould("response email error", function* () {
      user = yield userHelper.initAndSignin(preparedUser, agent);
      res = yield userHelper.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
      }, agent);
      expect(res.body.errCode).to.equal(Errors.NameBlankWhenUpdateUser);
    });
  });

  describe("When phone is error", () => {
    let updatedName = 'updatedName',
      updatedEmail = 'updatedUserEmail@163.com',
      updatedPhone = 'updatedPhone';

    itShould("response email error", function* () {
      user = yield userHelper.initAndSignin(preparedUser, agent);
      res = yield userHelper.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
      }, agent);
      expect(res.body.errCode).to.equal(Errors.PhoneErrorWhenUpdateUser);
    });
  });

});
