'use strict';

let Agent = require('superagent').agent;
let Const = require('../test-const');
let Promise = require('bluebird');

let request = (method, url, data, client) => {
    let agent = client ? client.agent((agent) => agent[method](url)) : Agent()[method](url);
    let defer = Promise.defer();
    agent.send({user: data})
        .end((err, res) => defer.resolve(res));
    return defer.promise;
};

let userJson = {
    name: 'user',
    password: 'password',
    confirmPassword: 'password',
    email: 'test@test.com',
    phone: '12345678901'
};

let signupWith = (user, client) => {
    return request('post', `${Const.host}/users`, user, client);
};


let signinWith = (user, client) => {
    return request('post', `${Const.host}/users/session`, user, client);
};

let userUpdate = (userId, user, client) => {
    return request('put', `${Const.host}/users/${userId}`, user, client);
};


module.exports = {
    signupWith,
    signinWith,
    userUpdate,
    createUser(options = {}) {
        let user = Object.assign({}, userJson, options);
        return signupWith(user).then(res => res.body.user);
    }
};
