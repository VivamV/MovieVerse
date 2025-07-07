import express from "express";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRouter..js";
const app = express();

const serverSetup = () => {
  app.use(
    cors({
      origin: process.env.MOVIEVERSE_UI_BASE_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use("/admin", adminRouter);
  app.use("/v1", userRouter);
  return app;
};

export default serverSetup;
