"use strict";

let Agent = require('superagent').agent;

class Client {
    constructor({email, password}) {
        this.email = email;
        this.password = password;
    }

    agent(fn) {
        return fn(Agent()).auth(this.email, this.password);
    }
}

module.exports = Client;