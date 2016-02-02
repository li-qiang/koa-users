'use strict'

let blankMap = {
  'array': (val) => !val.length,
  'string': (val) => !val.length,
  'object': (val) => !Object.key(val).length,
  'number': () => false
}

module.exports = {
  blank(val) {
    if (val === null) return true;
    if (val === undefined) return true;
    return blankMap[typeof val](val);
  },

  present(val) {
    return !this.blank(val);
  }
}
