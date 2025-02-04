const express = require("express");
const personal_plan_Router = express.Router();
const db = require("../config/db");

// Add a personal plan
personal_plan_Router.post("/add", (req, res) => {
  const body = req.body;

  if (!body || !body.text || typeof body.text !== "string") {
    return res
      .status(400)
      .json({ message: "Invalid data: 'text' must be a string." });
  }

  const query = "INSERT INTO plan (text) VALUES (?)";
  db.query(query, [body.text], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error saving data", error: err });
    }
    res.status(201).json({ message: "Data received successfully" });
  });
});

// Show all personal plans
personal_plan_Router.get("/show", (req, res, next) => {
  const query = "SELECT * FROM user_plan";

  db.query(query, (err, results) => {
    if (err) {
      return next(err);
    }
    res.json(results);
  });
});

module.exports = personal_plan_Router;
