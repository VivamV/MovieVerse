import dotenv from "dotenv";
dotenv.config();

import dbconnection from "./config/db.js";
import redisClient from "./config/redisClient.js";
import serverSetup from "./server.js";

const port = process.env.PORT || 4000;
console.log("Port in index file", port,process.env.PORT);
const startServer = async () => {
  try {
    await dbconnection();

    await redisClient.connect();
    console.log("Redis connected");

    serverSetup().listen(port, () =>
      console.log(` Server started at PORT ${port}`)
    );
  } catch (err) {
    console.error("Server Startup failed:", err);
    process.exit(1);
  }
};

startServer();
