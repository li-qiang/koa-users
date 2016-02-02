'use strict'
let path = require('path');
let dbPath = path.join(__dirname, 'test.db');
let appPort = 4321;
module.exports = {
  appPort,
  env: 'test',
  host: `http://127.0.0.1:${appPort}`,
  dbPath
}
