'use strict';

var crypto = require('crypto');

var generateNumericValue = function generateNumericValue(length) {
  return parseInt(crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length), 16).toString().padStart(length, '0');
};

module.exports = generateNumericValue;
//# sourceMappingURL=NumericId.js.map