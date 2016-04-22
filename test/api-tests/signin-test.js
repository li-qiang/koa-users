'use strict';
let expect = require("chai").expect;
let gRunner = require('../helpers/g-runner');
let signinWith = require('../helpers/user-helper').signinWith;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');

describe("Signin User", () => {

    let res, user, models, db;
    beforeEach(gRunner(function*() {
        db = yield loadDB;
        yield db.qExecQuery('delete from user;');
        models = db.models;
    }));

    describe("When user exist", () => {

        beforeEach(gRunner(function*() {
            user = {
                name: 'user',
                password: 'password'
            };
            yield models.user.qCreate(user);
            res = yield signinWith(user);
        }));

        it('return user', gRunner(function*() {
            expect(res.body.user).to.include(user);
        }));

        it('set cookie', gRunner(function*() {
            expect(res.headers['set-cookie']).to.be.ok;
        }));
    });

    describe("When post data is error", () => {
        beforeEach(gRunner(function*() {
            user = {
                email: 'test@test.com',
                password: 'password'
            };
        }));

        it('return email error when email do not exist', gRunner(function*() {
            res = yield signinWith(user);
            expect(res.status).to.equal(401);
            expect(res.body.errCode).to.equal(Errors.SigninEmailError);
        }));

        it('return password error when password is error', gRunner(function*() {
            yield models.user.qCreate(user);
            res = yield signinWith({email: user.email, password: 'errorPassword'});
            expect(res.status).to.equal(401);
            expect(res.body.errCode).to.equal(Errors.SigninPasswordError);
        }));
    });

});
