const db = require("../db");

async function createNotification(
  userId,
  senderId,
  type,
  objectId = null
) {
  if (userId === senderId) return;

  await db.query(
    "INSERT INTO notifications (user_id, sender_id, notification_type, object_id) VALUES ($1, $2, $3, $4)",
    [userId, senderId, type, objectId]
  );
    
}

module.exports = createNotification;
