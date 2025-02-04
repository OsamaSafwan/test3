const admin = require("firebase-admin");
const serviceAccount = require("../config/push-notification-key.json");

//  Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = (req, res) => {
  try {
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

    // send notication
    admin
      .messaging()
      .send(message)
      .then((response) => {
        return res
          .status(200)
          .send({ message: "Notification sent successfully", response });
      })
      .catch((error) => {
        return res
          .status(500)
          .send({ message: "Error sending notification", error });
      });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Unexpected error", error: err.message });
  }
};
