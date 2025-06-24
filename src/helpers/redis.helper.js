import { createClient } from "redis";

export const redisPub = createClient({
  url: "redis://localhost:6379",
});

export const redisSub = createClient({
  url: "redis://localhost:6379",
});

redisPub.on("error", (err) => console.error("redisPub error:", err));
redisSub.on("error", (err) => console.error("redisSub error:", err));

await redisPub.connect();
await redisSub.connect();
