const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = { pool }; 