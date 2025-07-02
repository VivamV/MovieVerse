import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { clearRedisData, getRedisData } from "../controllers/adminController.js";

const adminRouter=express.Router();

adminRouter.get('/get-redis',auth, getRedisData);

adminRouter.delete('/clear-redis',auth,clearRedisData);

export default adminRouter;