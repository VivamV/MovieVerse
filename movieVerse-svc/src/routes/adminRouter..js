import express from "express";
import { clearRedisData, getRedisData,uploadRawVideo,convertVideo } from "../controllers/adminController.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const adminRouter=express.Router();

//Redis Related Routes
adminRouter.get('/get-redis', getRedisData);

adminRouter.delete('/clear-redis',clearRedisData);

//Streaming Related Routes
adminRouter.post('/upload-raw-video',upload.single("video"),uploadRawVideo);

adminRouter.post('/get-and-upload-processed-videos',convertVideo);

export default adminRouter;