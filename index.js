import express from "express";
import db from "./src/config/db/index.js";
import route from "./src/routes/index.js";
import "./src/config/env.js";
import path from "path";
import { fileURLToPath } from "url";

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
await route(app);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

app.use((req, res) => {
  res.status(404).json({
    message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
  });
});
