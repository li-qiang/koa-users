'use strict';
let expect = require("chai").expect;
let gRunner = require('../helpers/g-runner');
let loadDB = require('../../utils/load-db');
let Errors = require('../../utils/error-codes');
let userHelper = require('../helpers/user-helper');
let expectResponse = require('../helpers/expect-response');
let Client = require('../helpers/client');

describe("User Update", () => {

    let res, user, models, db;


    beforeEach(gRunner(function*() {
        db = yield loadDB;
        yield db.qExecQuery('delete from user;');
        models = db.models;
    }));

    describe('When user exist', () => {

        let currentUser, client,
            updatedName = 'updatedUserName',
            updatedEmail = 'updatedUserEmail@163.com',
            updatedPhone = '12332112312';

        beforeEach(gRunner(function *() {
            currentUser = yield userHelper.createUser();
            client = new Client(currentUser);
        }));

        describe("When post data is ok", () => {

            beforeEach(gRunner(function*() {
                res = yield userHelper.userUpdate(currentUser.id, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone
                }, client);
            }));

            it("response with a user", gRunner(function*() {
                expect(res.status).to.equal(200);
                expect(res.body.user.name).to.equal(updatedName);
                expect(res.body.user.email).to.equal(updatedEmail);
                expect(res.body.user.phone).to.equal(updatedPhone);
            }));

            it('update user in database', gRunner(function*() {
                let savedUser = yield models.user.qGet(currentUser.id);
                expect(savedUser).to.be.ok;
                expect(savedUser.name).to.equal(updatedName);
                expect(savedUser.phone).to.equal(updatedPhone);
            }));
        });

        describe('When request without basic auth', () => {
            it('response no access', gRunner(function*() {
                res = yield userHelper.userUpdate(currentUser.id, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone
                });
                expectResponse(res).toBeErrorWithMessage(Errors.NoAccess);
            }));
        });

        describe("When email is error", () => {
            let updatedName = 'updatedUserName',
                updatedEmail = 'updatedUserEmail',
                updatedPhone = '12332112312';

            it("response email error", gRunner(function*() {
                res = yield userHelper.userUpdate(currentUser.id, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone
                }, client);
                expectResponse(res).toBeErrorWithMessage(Errors.InvalidEmail);
            }));
        });

        describe("When name is blank", () => {
            let updatedName = '',
                updatedEmail = 'updatedUserEmail@163.com',
                updatedPhone = '12332112312';

            it("response invalid name", gRunner(function*() {
                res = yield userHelper.userUpdate(currentUser.id, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone
                }, client);
                expectResponse(res).toBeErrorWithMessage(Errors.InvalidName);
            }));
        });


        describe("When phone is error", () => {
            let updatedName = 'updatedName',
                updatedEmail = 'updatedUserEmail@163.com',
                updatedPhone = 'updatedPhone';

            it("response email error", gRunner(function*() {
                res = yield userHelper.userUpdate(currentUser.id, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone
                }, client);
                expectResponse(res).toBeErrorWithMessage(Errors.InvalidPhone);
            }));
        });
    });
});
