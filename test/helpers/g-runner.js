'use strict';

var co = require('co');

module.exports = (gen) => {
    return (done) => co(gen).then(done);
};