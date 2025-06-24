import redis from "../config/redis.js";

const cacheWrapper = async (key, ttlSeconds, fetchFn) => {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(" Lấy từ cache:", key);
      return JSON.parse(cached);
    }

    const freshData = await fetchFn();

    if (freshData) {
      await redis.set(key, JSON.stringify(freshData), { EX: ttlSeconds });
      console.log("Cache mới:", key);
    }

    return freshData;
  } catch (err) {
    console.error(`Redis lỗi với key: ${key} → fallback DB`, err.message);

    // Redis lỗi → fallback lấy từ DB
    try {
      const freshData = await fetchFn();
      return freshData;
    } catch (innerErr) {
      throw new Error("DB fetch thất bại khi Redis cũng lỗi");
    }
  }
};

export default cacheWrapper;
