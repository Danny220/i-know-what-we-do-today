// Load variables from .env file
require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
  };
  if (isProduction) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

// Create a connection pool
const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
