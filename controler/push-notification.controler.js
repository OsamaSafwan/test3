const admin = require("firebase-admin");
const serviceAccount = require("push-notification-key");
const getUserDataQuery =
  "SELECT username FROM users WHERE Notification_intensity = ?";
const mysql = require("mysql2");
const db = require("../config/db");

// Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = (req, res) => {
  try {
    // تحقق من وجود FCM token و intensity
    if (!req.body.FCM || !req.body.FCM.token) {
      return res
        .status(400)
        .json({ message: "FCM token is required in the request body" });
    }
    if (!req.body.intensity) {
      return res
        .status(400)
        .json({ message: "Intensity is required in the request body" });
    }

    const message = {
      notification: {
        title: "Test Notification",
        body: "Notification Message",
      },
      data: {
        id: "123",
        date: new Date().toISOString(),
      },
      token: req.body.FCM.token,
    };

    // استرجاع المستخدمين بناءً على الشدة
    db.query(getUserDataQuery, [req.body.intensity], (err, results) => {
      if (err) {
        console.error("Error retrieving user data:", err); // سجل الخطأ
        return res
          .status(500)
          .json({ message: "Error retrieving user data", error: err.message });
      }

      const users = results.map((user) => user.username);
      if (users.length > 0) {
        message.notification.title = `Alert for intensity ${
          req.body.intensity
        } for users: ${users.join(", ")}`;

        admin
          .messaging()
          .send(message)
          .then((response) => {
            return res
              .status(200)
              .json({ message: "Notification sent successfully", response });
          })
          .catch((error) => {
            console.error("Error sending notification:", error); // سجل الخطأ
            return res.status(500).json({
              message: "Error sending notification",
              error: error.message,
            });
          });
      } else {
        return res
          .status(404)
          .json({ message: "No users found with this intensity" });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err); // سجل الخطأ
    return res
      .status(500)
      .json({ message: "Unexpected error", error: err.message });
  }
};
