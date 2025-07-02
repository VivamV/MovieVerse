import express from "express";
import userRouter from "./routes/userRouter.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRouter..js";
const app = express();


const serverSetup = () => {
  app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true              
}))
  app.use(cookieParser())
  app.use(express.json());
  //app.use(express.urlEncoded({extended:false}))
  app.use("/admin",adminRouter);
  app.use("/v1",userRouter);
  return app;
};

export default serverSetup;


