'use strict'
let fs = require('fs');
let path = require('path');

let loadDir = (dir) => {
  fs.readdirSync(dir)
    .forEach((file) => {
      let filePath = path.join(dir, file);
      let isDirectory = fs.statSync(filePath).isDirectory();
      if (isDirectory) return loadDir(filePath)
      if (/\.js$/.test(file)) require(filePath);
    });
}

module.exports = loadDir;
