function fib(number) {
  if (number <= 2) return 1;
  return fib(number - 1) + fib(number - 2);
}

async function getRedisClient() {
  const { createClient } = require("redis");
  const client = await createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  return client;
}

async function main() {
  const redisClient = await getRedisClient();
  const sub = redisClient.duplicate();
  await sub.connect();
  // sub.on("message");
  // const listener = (message, channel) => console.log(message, channel);
  await sub.subscribe("insert", (message, channel) => {
    redisClient.hSet("values", message, fib(parseInt(message)));
  });

  //   await redisClient.disconnect();
}

main();
