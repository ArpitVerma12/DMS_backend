const pool = require('../config/pool');

const createTables = async () => {
  let client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS demo
      (
        id SERIAL PRIMARY KEY,
        name varchar(255),
        d_id varchar(255) NOT NULL UNIQUE,
        Category varchar(255),
        Number INTEGER,
        playList boolean,
        url varchar(255),
        size varchar(255),
        Type varchar(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Tables created successfully');
  } catch (err) {
    console.error(err);
  // } finally {
  //   if (client) {
  //     await client.release();
  //   }
  }
};

module.exports = { createTables };
