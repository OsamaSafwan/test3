const express = require("express");
const user_stings_router = express.Router();
const db = require("../config/db");

// إضافة إعدادات مستخدم
user_stings_router.post("/add", (req, res) => {
  const { username, night_mode, font_style, language } = req.body;
  const query =
    "INSERT INTO user_settings (username, night_mode, font_style, language) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [username, night_mode, font_style, language],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error saving settings", error: err });
      }
      res.status(201).json({ message: "Settings saved successfully" });
    }
  );
});

module.exports = user_stings_router;
