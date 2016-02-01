'use strict'

module.exports = (db, cb) => {

  db.qDefine('user', {
    id: {type: 'serial', key: true}, // the auto-incrementing primary key
    name: {type: 'text'},
    password: {type: 'text'},
    email: {type: 'text'},
    phone: {type: 'text'}
  }, {
    methods: {}
  });

  return cb();
};
