// const { Pool } = require('pg');

// const password = '9AtCvqMV8E9O6Ir1gdBgg3IgaKjlAG66';
// const connectionString = 'postgresql://arpit:' + password + '@dpg-cmp4k12cn0vc73cl5m70-a.singapore-postgres.render.com:5432/dms_o796?ssl=true';

// const pool = new Pool({
//   connectionString,
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// module.exports = pool;

const { Pool } = require('pg');

// const password = 'a1gsnYw3bF9PM44q4KIibnv4ploH1ijx'

// const pool = new Pool
// (
//   {
//     connectionString: process.env.DATABASE_URL|| `postgres://kspl:a1gsnYw3bF9PM44q4KIibnv4ploH1ijx@dpg-ch9p70pjvhtimra44j2g-a.singapore-postgres.render.com/nigst?ssl=true`
//   }
// );

const host = 'ec2-3-110-220-80.ap-south-1.compute.amazonaws.com'
const database = 'dms'
const username = 'dms_user'
const password = 'kspl@123'
const port = 5432; 
const pool = new Pool({
  host,
  database,
  user: username,
  password,
  port,
})
// const host = 'nigst-database.ct7tofa2ajsn.ap-south-1.rds.amazonaws.com'
// const database = 'nigst'
// const username = 'kspl'
// const password = 'KSPL123#'
// const port = 5432; 
// const pool = new Pool({
//   host,
//   database,
//   user: username,
//   password,
//   port,
// })

module.exports = pool;

