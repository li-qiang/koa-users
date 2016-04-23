'use strict';
let expect = require("chai").expect;
let gRunner = require('../helpers/g-runner');
let userHelper = require('../helpers/user-helper');
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');
let Client = require('../helpers/client');
let expectResponse = require('../helpers/expect-response');

describe("Signin User", () => {

    let res, user, models, db, client;
    beforeEach(gRunner(function*() {
        db = yield loadDB;
        yield db.qExecQuery('delete from user;');
        models = db.models;
        user = {
            email: 'user@test.com',
            password: 'password'
        };
    }));

    describe("When user exist", () => {

        beforeEach(gRunner(function*() {
            let currentUser = yield userHelper.createUser(user);
            client = new Client(currentUser);
            res = yield userHelper.signinWith(user, client);
        }));

        it('return user', gRunner(function*() {
            expect(res.body.user).to.include(user);
        }));
    });

    describe("When post data is error", () => {
        beforeEach(gRunner(function*() {
            client = new Client({email: user.email, password: 'Invalid Password'});
            res = yield userHelper.signinWith(user, client);
        }));

        it('return email error when email do not exist', gRunner(function*() {
            expectResponse(res).toBeErrorWithMessage(Errors.InvalidUser);
        }));
    });

});
