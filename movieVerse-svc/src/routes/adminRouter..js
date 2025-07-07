import express from "express";
import { clearRedisData, getRedisData } from "../controllers/adminController.js";

const adminRouter=express.Router();

adminRouter.get('/get-redis', getRedisData);

adminRouter.delete('/clear-redis',clearRedisData);

export default adminRouter;