import Notification from "../../src/app/models/Notification.js";
import { redisPub } from "../helpers/redis.helper.js";

export const sendUserNotification = async (user_id, title, message) => {
  const notification = await Notification.create({ user_id, title, message });

  await redisPub.publish(
    `notifications:${user_id}`,
    JSON.stringify(notification)
  );
};
