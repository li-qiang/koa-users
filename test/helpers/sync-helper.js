'use strict';

let runGenerator = (g, done) => {
    var it = g(),
        ret;
    // asynchronously iterate over generator
    (function iterate(val) {
        ret = it.next(val);
        if (!ret.done) {
            // poor man's "is it a promise?" test
            if ("then" in ret.value) {
                // wait on the promise
                ret.value.then(iterate);
            }
            // immediate value: just send right back in
            else {
                // avoid synchronous recursion
                setTimeout(() => iterate(ret.value));
            }
        } else {
            done();
        }
    })();
};

const itShould = (describe, generator) => {
    it(`should ${describe}`, (done) => runGenerator(generator, done));
};

itShould.only = (describe, generator) => {
    it.only(`should ${describe}`, (done) => runGenerator(generator, done));
};

const beforeEachSync = (generator) => {
    beforeEach((done) => runGenerator(generator, done));
};

const afterEachSync = (generator) => {
    afterEach((done) => runGenerator(generator, done));
};

module.exports = {
    itShould,
    beforeEachSync,
    afterEachSync
};