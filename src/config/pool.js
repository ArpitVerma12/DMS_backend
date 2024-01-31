const { Pool } = require('pg');

const password = '9AtCvqMV8E9O6Ir1gdBgg3IgaKjlAG66';
const connectionString = 'postgresql://arpit:' + password + '@dpg-cmp4k12cn0vc73cl5m70-a.singapore-postgres.render.com:5432/dms_o796?ssl=true';

const pool = new Pool({
  connectionString,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;

