import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: 10, // Reduce retries for faster failure
  retryStrategy(times) {
    console.log(`Retrying connection, attempt ${times}`);
    return Math.min(times * 100, 2000); // Wait up to 2 seconds
  },
  tls: {}, // Explicitly enable TLS for Upstash
});

// Handle connection events
redis.on("connect", () => {
  console.log("Connected to Upstash Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

// Test the connection in an async function
async function testRedis() {
  try {
    await redis.set("foo", "bar");
    const result = await redis.get("foo");
    console.log("Value of foo:", result);
  } catch (err) {
    console.error("Failed to set/get value:", err);
  }
}

// Run the test
testRedis();