const express = require("express");
const cors = require("cors");
const { query } = require("./pgConfig");
const { RedisClient } = require("./redisConfig");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/version", (req, res) => {
  res.json({ version: "v1" });
});

app.get("/values/all", async (req, res) => {
  try {
    const result = await query("SELECT * FROM values");
    res.json({
      values: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error when getting all values",
    });
  }
});

app.get("/values/current", async (req, res) => {
  try {
    const redisClient = await RedisClient.getInstance();
    const values = await redisClient.hGetAll("values");
    res.json({ values });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error when getting current values",
    });
  }
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.json({
      message: "Index too high",
    });
  }

  try {
    const redisClient = await RedisClient.getInstance();
    const redisPub = redisClient.duplicate();
    await redisClient.hSet("values", index, "Nothing yet");
    await redisPub.connect();
    await redisPub.publish("insert", index + "");

    await query("INSERT INTO values (number) VALUES ($1)", [index]);

    res.json({
      message: "Calculated ",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error when calculating new fib at index: " + index,
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
