import express from "express";
import db from "./src/config/db/index.js";
import route from "./src/routes/index.js";
import "./src/config/env.js";

db.connect();

const app = express();
// app.use(cookieParser());
const port = 3000;

app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));

await route(app);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
