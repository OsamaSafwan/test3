const admin = require("firebase-admin");
const serviceAccount = require("../config/push-notification-key.json");
const getUserDataQuery =
  "SELECT username, Notification_intensity FROM users WHERE intensity = ?";
//  Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = (req, res) => {
  try {
    if (!req.body.FCM || !req.body.FCM.token) {
      return res
        .status(400)
        .json({ message: "FCM token is required in the request body" });
    }

    const message = {
      notification: {
        title: "Test Notification",
        body: "Notification Message",
      },
      data: {
        id: "123",
        date: "2024-11-30",
      },
      token: req.body.FCM.token,
    };

    // Retrieve users with the same intensity from the database
    db.query(getUserDataQuery, [req.body.intensity], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error retrieving user data", error: err });
      }

      const users = results.map((user) => user.username);
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
          return res
            .status(500)
            .json({ message: "Error sending notification", error });
        });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Unexpected error", error: err.message });
  }
};
