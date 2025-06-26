import express from "express";
import router from "./routes/userRouter.js";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();


const serverSetup = () => {
  app.use(cors())
  app.use(cookieParser())
  app.use(express.json());
  //app.use(express.urlEncoded({extended:false}))
  app.use(router);
  return app;
};

export default serverSetup;


