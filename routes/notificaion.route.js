const PushNotificationControuler = require("../controler/push-notification.controler");
const express = require("express");
const router = express.Router();
router.post(
  "/send-notification",
  PushNotificationControuler.sendPushNotification
);
module.exports = router;
