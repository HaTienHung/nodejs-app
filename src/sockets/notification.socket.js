import { redisSub } from "../helpers/redis.helper.js";

export const socketNotification = (io) => {
  // Sub kênh Redis (dành cho toàn bộ user)
  redisSub.pSubscribe("notifications:*", (message, channel) => {
    const userId = channel.split(":")[1];
    const noti = JSON.parse(message);

    // Gửi tới client socket của user đó
    io.to(userId).emit("notification", noti);
  });
};
