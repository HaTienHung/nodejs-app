// src/config/redis.js
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL, // Hoặc REDIS_URL từ env
});

redis.on("error", (err) => {
  console.error(" Redis Client Error:", err);
});

await redis.connect();

export default redis;
