'use strict'
let expect = require("chai").expect;
let syncHelper = require('../helpers/sync-helper');
let itShould = syncHelper.itShould;
let beforeEachSync = syncHelper.beforeEachSync;
let afterEachSync = syncHelper.afterEachSync;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');

let Agent = require('superagent').agent;

let userHelper = require('../helpers/user-helper');

describe("Update User", () => {

  let res, user, models, db,
    agent = new Agent(),
    preparedUser = {
      name: 'user',
      password: 'password',
      confirmPassword: 'password',
      email: 'test@test.com',
      phone: '12345678901'
    };

  beforeEachSync(function* () {
    db = yield loadDB;
    yield db.qExecQuery('delete from user;');
    models = db.models;
  });

  describe("When post data is ok", () => {
    let updatedName = 'updatedUserName',
      updatedEmail = 'updatedUserEmail@163.com',
      updatedPhone = '12332112312';

    beforeEachSync(function* () {
      let signupRes = yield userHelper.signupWith(preparedUser, agent);
      user = signupRes.body.user;
      res = yield userHelper.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
      });
    });

    itShould("response with a user", function* () {
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

  describe("When email is error", () => {
    let updatedName = 'updatedUserName',
      updatedEmail = 'updatedUserEmail',
      updatedPhone = '12332112312';

    beforeEachSync(function* () {
      let signupRes = yield userHelper.signupWith(preparedUser, agent);
      user = signupRes.body.user;
      res = yield userHelper.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
      });
    });

    itShould("response email error", function* () {
      expect(res.body.errCode).to.equal(Errors.EmailErrorWhenUpdateUser);
    });
  });
});
