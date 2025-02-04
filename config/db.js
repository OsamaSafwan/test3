const mysql = require("mysql2");
const env = require("dotenv").config();

const db = mysql.createPool({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to database.");

  connection.release();
});

module.exports = db;
