'use strict'

let fs = require('fs');
let path = require('path');

let configPath = path.join(__dirname, '..', 'config', 'app.json');

let configContent = fs.readFileSync(configPath).toString();

module.exports = JSON.parse(configContent);
