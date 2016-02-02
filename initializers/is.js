'use strict'

let is = require('is_js');

let blankMap = {
  'array': (val) => !val.length,
  'string': (val) => !val.length,
  'object': (val) => !Object.key(val).length,
  'number': () => false
}

is.blank = (val) => {
  if (val === null) return true;
  if (val === undefined) return true;
  return blankMap[typeof val](val);
}

is.present = (val) => {
  return !is.blank(val);
}

is.phoneNumber = (val) => {
  return /^1\d{10}$/.test(val);
}

module.exports = null;
