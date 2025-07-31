import express from "express";
import { clearRedisData, getRedisData,getPresignedUrl,saveVideoMetadata
    ,convertVideoJob
} from "../controllers/adminController.js";
import multer from "multer";
import { ecsCallback } from "../controllers/streamingController.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const adminRouter=express.Router();

//Redis Related Routes
adminRouter.get('/get-redis', getRedisData);

adminRouter.delete('/clear-redis',clearRedisData);

//Streaming Related Routes
// adminRouter.post('/upload-raw-video',upload.single("video"),uploadRawVideo);
adminRouter.post('/get-presigned-url',getPresignedUrl);

adminRouter.post('/save-video-metadata',saveVideoMetadata);

adminRouter.post('/get-and-upload-processed-videos',convertVideoJob);

adminRouter.post('/ecs-callback',ecsCallback);

export default adminRouter;