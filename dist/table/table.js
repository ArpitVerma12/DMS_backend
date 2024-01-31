'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pool = require('../config/pool');

var createTables = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var client;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return pool.connect();

          case 2:
            client = _context.sent;
            _context.prev = 3;
            _context.next = 6;
            return client.query('\n      CREATE TABLE IF NOT EXISTS demo\n      (\n        id SERIAL PRIMARY KEY,\n        name varchar(255),\n        d_id varchar(255) NOT NULL UNIQUE,\n        Category varchar(255),\n        Number INTEGER,\n        playList boolean,\n        url varchar(255),\n        size varchar(255),\n        Type varchar(255),\n        created_at TIMESTAMP DEFAULT NOW()\n      )\n    ');

          case 6:

            console.log('Tables created successfully');
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);

            console.error(_context.t0);
            // } finally {
            //   if (client) {
            //     await client.release();
            //   }

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function createTables() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = { createTables: createTables };
//# sourceMappingURL=table.js.map