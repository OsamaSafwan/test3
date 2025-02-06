const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { ValidationError } = require("../config/errors");

let sensorDataBuffer = [];
let isCollecting = false;
let timeoutId;
// collecting data
const collectSensorData = (intensity) => {
  sensorDataBuffer.push(intensity);
};

// max value
const recordMaxValue = () => {
  if (sensorDataBuffer.length > 0) {
    const maxIntensity = Math.max(...sensorDataBuffer);
    const time_happend = new Date().toISOString(); // مثال على كيفية الحصول على الطابع الزمني
    const query =
      "INSERT INTO sensor_data (intensity, time_happend, location) VALUES (?, ?, ?)";

    db.query(
      query,
      [maxIntensity, time_happend, "Unknown Location"],
      (err, results) => {
        if (err) {
          console.error("Error saving max value:", err);
        } else {
          console.log(`Max intensity recorded: ${maxIntensity}`);
        }
      }
    );

    sensorDataBuffer = [];
  }
};

// Endpoint
router.post("/sensor-data", (req, res, next) => {
  const { intensity } = req.body;

  if (typeof intensity !== "number") {
    return next(new ValidationError("Invalid data: intensity is required."));
  }

  // 30 sec timer
  if (!isCollecting) {
    isCollecting = true;
    sensorDataBuffer = [];
    collectSensorData(intensity);

    timeoutId = setTimeout(() => {
      recordMaxValue();
      isCollecting = false;
    }, 30000);
  } else {
    collectSensorData(intensity);
  }

  res.status(200).json({ message: "Data received successfully" });
});

// stop befor 30 sec
router.post("/stop-collection", (req, res) => {
  if (isCollecting) {
    clearTimeout(timeoutId);
    recordMaxValue();
    isCollecting = false;
    res.status(200).json({ message: "Data collection stopped." });
  } else {
    res.status(400).json({ message: "No data collection in progress." });
  }
});

router.get("/sensor-data", (req, res, next) => {
  const query = "SELECT * FROM sensor_data";

  db.query(query, (err, results) => {
    if (err) {
      return next(err);
    }
    res.json(results);
  });
});

module.exports = router;
