import { createClient } from "redis";
const redisClient = createClient();

(async () => {
  await redisClient
    .on("error", (err) => console.log("Redis client error: ", err))
    .connect();
})();

export default redisClient;
