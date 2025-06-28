// src/config/redis.js
import { createClient } from "redis";

const redis = createClient({
  host: "redis", // tên service redis
  port: 6379, // Hoặc REDIS_URL từ env
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error(" Redis Client Error:", err);
});

await redis.connect();

export default redis;
