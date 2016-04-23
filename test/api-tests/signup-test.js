'use strict';
let expect = require("chai").expect;
let gRunner = require('../helpers/g-runner');
let signupWith = require('../helpers/user-helper').signupWith;
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');
let expectResponse = require('../helpers/expect-response');

describe("Signup User", () => {

    let res, user, models, db;

    beforeEach(gRunner(function*() {
        db = yield loadDB;
        yield db.qExecQuery('delete from user;');
        models = db.models;
    }));

    describe("When post data is ok", () => {
        beforeEach(gRunner(function*() {
            user = {
                name: 'user',
                password: 'password',
                confirmPassword: 'password',
                email: 'test@test.com',
                phone: '12345678901'
            };
            res = yield signupWith(user);
        }));

        it("response with a user when post data is ok", gRunner(function*() {
            expect(res.body.user.name).to.equal(user.name);
            expect(res.body.user.email).to.equal(user.email);
            expect(res.body.user.phone).to.equal(user.phone);
        }));

        it('create a user in database', gRunner(function*() {
            let foundUser = yield models.user.qOne({
                email: user.email
            });
            expect(foundUser.id).to.be.a('number');
            expect(foundUser.name).to.equal(user.name);
        }));
    });

    describe("When post data is error", () => {
        beforeEach(gRunner(function*() {
            user = {
                name: 'user',
                password: 'password',
                confirmPassword: 'password',
                email: 'test@test.com',
                phone: '12345678901'
            };
        }));

        it('return error code when user name is null', gRunner(function*() {
            user.name = null;
            res = yield signupWith(user);
            expectResponse(res).toBeErrorWithMessage(Errors.InvalidName);
        }));

        it('return error code when user password is null', gRunner(function*() {
            user.password = null;
            res = yield signupWith(user);
            expectResponse(res).toBeErrorWithMessage(Errors.InvalidPassword);
        }));

        it('return error code when user email is error', gRunner(function*() {
            user.email = '';
            res = yield signupWith(user);
            expectResponse(res).toBeErrorWithMessage(Errors.InvalidEmail);
        }));

        it('return error code when user phone is error', gRunner(function*() {
            user.phone = '11';
            res = yield signupWith(user);
            expectResponse(res).toBeErrorWithMessage(Errors.InvalidPhone);
        }));

        it('return error code when user confirmPassword is diffrent with password', gRunner(function*() {
            user.confirmPassword = 'aaaa';
            res = yield signupWith(user);
            expectResponse(res).toBeErrorWithMessage(Errors.InvalidConfirmPassword);
        }));

        it('return error code when user email exist', gRunner(function*() {
            yield signupWith(user);
            res = yield signupWith(user);
            expectResponse(res).toBeErrorWithMessage(Errors.EmailExist);
        }));

    });
});
