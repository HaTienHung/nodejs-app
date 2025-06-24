import express from "express";
import db from "./src/config/db/index.js";
import route from "./src/routes/index.js";
import "./src/config/env.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { socketNotification } from "./src/sockets/notification.socket.js";

db.connect();

const app = express();
// app.use(cookieParser());
const port = 3000;

app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// Khôi phục __dirname trong ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình static files
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);

await route(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.user_id;
  if (userId) socket.join(userId); // Gán userId vào room riêng

  console.log(`User connected: ${userId}`);
});

socketNotification(io);

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

app.use((req, res) => {
  res.status(404).json({
    message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
  });
});
