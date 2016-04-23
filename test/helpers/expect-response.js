"use strict";
let expect = require("chai").expect;


class RsponseHandler {

    constructor(response) {
        this.response = response;
    }

    toBeErrorWithMessage(message) {
        expect(this.response.body.error).to.equal(1);
        expect(this.response.body.errorMsg).to.equal(message);
    }
}

module.exports = (res) => new RsponseHandler(res);