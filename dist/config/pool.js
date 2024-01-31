'use strict';

var _require = require('pg'),
    Pool = _require.Pool;

var password = '9AtCvqMV8E9O6Ir1gdBgg3IgaKjlAG66';
var connectionString = 'postgresql://arpit:' + password + '@dpg-cmp4k12cn0vc73cl5m70-a.singapore-postgres.render.com:5432/dms_o796?ssl=true';

var pool = new Pool({
  connectionString: connectionString
});

pool.on('error', function (err) {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
//# sourceMappingURL=pool.js.map