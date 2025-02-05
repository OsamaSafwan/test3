const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const sensorRoutes = require("./routes/sensorRoutes");
const notificationRoutes = require("./routes/notificaion.route");
const userRouter = require("./routes/login");
const userStingsRouter = require("./routes/userstings.route");
const userPlan = require("./routes/personal_plan.route");
const admin = require("firebase-admin");
const {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} = require("./config/errors");

const app = express();
const Port = 5000 ||process.env.PORT;

// Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API routes
app.use("/api", sensorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRouter);
app.use("/api/user/settings", userStingsRouter);
app.use("/api/plan", userPlan);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: "Resource not found" });
  }

  // Handle other types of errors
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Start the server
app.listen(Port , () => {
  console.log(`Server is running on port: ${Port}`);
});
