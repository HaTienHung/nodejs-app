// test.client.js
import { io } from "socket.io-client";

const userId = "6856bd08389851dcc1346cc1";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"], // fallback
  query: {
    user_id: userId,
  },
});

socket.on("connect", () => {
  console.log(`Connected as user ${userId}`);
});

socket.on("notification", (data) => {
  console.log("Received notification:", data);
});

socket.on("disconnect", () => {
  console.log(" Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Socket error:", err.message);
});
