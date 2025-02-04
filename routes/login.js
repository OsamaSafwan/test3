const express = require("express");
const user_router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

user_router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error saving data", error: err });
    }
    console.log(`Welcome ${username}`);
    res.status(201).json({ message: "Data received successfully" });
  });
});

// تسجيل الدخول
user_router.post("/login", (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const query = "SELECT password, username FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching data", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const dbPassword = results[0].password;

    const match = await bcrypt.compare(password, dbPassword);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const username = results[0].username;
    res.json({ message: "Login successful, welcome", username });
  });
});
module.exports = user_router;
