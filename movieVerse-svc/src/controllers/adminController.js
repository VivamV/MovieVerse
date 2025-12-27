import redisClient from "../config/redisClient.js";
import AWS from "aws-sdk";
// import path from "path";
// import fs from "fs";
// import ffmpeg from "fluent-ffmpeg";
// import os from "os";
import { v4 as uuidv4 } from "uuid";
import { StreamingMoviesModel } from "../models/streamingSchema.js";
import {
  getRedisVidepProcessingData,
  // deleteRedisJob,
} from "../utils/redisFunctions.js";
import { runECSTask } from "./streamingController.js";

const s3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

//Redis related Controllers
export const getRedisData = async (req, res) => {
  try {
    console.log("inside getRedisData Controller:");
    const keys = await redisClient.keys("*");

    const pipeline = redisClient.multi();
    keys.forEach((key) => pipeline.get(key));

    const values = await pipeline.exec();

    const result = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (err) {
    console.error("Redis fetch error:", err);
    res.status(500).json({ message: "Failed to fetch Redis keys and values." });
  }
};

export const clearRedisData = async (req, res) => {
  try {
    console.log("inside clearRedisData Controller:");
    await redisClient.flushAll();
    res.status(200).json({ message: "Redis cleared successfully." });
  } catch (err) {
    console.error("Redis clear error in clearRedisData:", err);
    res.status(500).json({ message: "Failed to clear Redis. inside clearRedisData" });
  }
};

//Streaming Related Controllers
// export const uploadRawVideo=async (req,res)=>{
//   try{
//     console.log("req received in UploadRawVideo Controller",req.file) ;
//     const file = req.file;
//     if (!file) return res.status(400).json({ message: "No video file uploaded" });

//     const originalFullName = file.originalname;
//     const movieTitle = originalFullName.replace(/\.[^/.]+$/, "");
//     const movieId = req.body.movieId || uuidv4();

//     const s3Key = `uploads/${movieId}_${originalFullName}`;
//     const s3Response = await s3.upload({
//         Bucket: "raw-videos-bucket-vivam",
//         Key: s3Key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//     }).promise();

//     const movieDoc = new StreamingMoviesModel({
//       movieId,
//       originalFullName,
//       movieTitle,

//       s3UploadRawLink: s3Response.Location,

//       first_air_date: req.body.first_air_date || "",
//       poster_path: req.body.poster_path || "",
//       original_language: req.body.original_language || "",
//       vote_average: req.body.vote_average || 0,
//     });

//     await movieDoc.save();
//     console.log("Video uploaded to S3:", s3Response.Location);
//     res.status(200).json({ message: "Video uploaded successfully", url: s3Response.Location });
//   }
//   catch(error){
//     console.error("Error in Uploading Raw Video to S3:", error);
//     res.status(500).json({ message: "Failed to upload raw video" });
//   }
// }

export const getPresignedUrl = async (req, res) => {
  try {
    const file = req.body;
    const movieId = req.body.movieId || uuidv4();
    const originalFullName = file.name;
    console.log("orginalFullName in getPresignedUrl", originalFullName);

    const s3Key = `uploads/${movieId}_${originalFullName}`;
    const params = {
      Bucket: "raw-videos-bucket-vivam",
      Key: s3Key,
      Expires: 300,
      // Body: file.buffer,
      ContentType: file.type,
    };
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    res.status(200).json({ uploadUrl, s3Key, movieId });
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
    res.status(500).json({ message: "Failed to generate pre-signed URL" });
  }
};

export const saveVideoMetadata = async (req, res) => {
  try {
    const {
      movieId,
      originalFullName,
      movieTitle,
      s3UploadRawLink,
      first_air_date,
      poster_path,
      original_language,
      vote_average,
    } = req.body;

    const movieDoc = new StreamingMoviesModel({
      movieId,
      originalFullName,
      movieTitle,
      s3UploadRawLink,
      first_air_date,
      poster_path,
      original_language,
      vote_average,
    });

    await movieDoc.save();

    res.status(200).json({ message: "Metadata saved" });
  } catch (err) {
    console.error("Error saving metadata", err);
    res.status(500).json({ message: "Failed to save metadata" });
  }
};
// export const convertVideo = async (req, res) => {
//   const { originalFullName,movieId } = req.body;
//   console.log(" Received file for conversion:", req.body);

//   const inputS3Key = `uploads/${movieId}_${originalFullName}`;
//   const tmpDir = os.tmpdir();
//   const inputPath = path.join(tmpDir, originalFullName);
//   // const outputFolder = path.join(tmpDir, "dash-output");
//    const outputFolder = path.join(tmpDir, "dash-output");
// // const outputMPDPath = path.join(outputFolder, 'output.mpd');
//   try {
//     // Step 1: Download input video from raw bucket
//     const file = await s3.getObject({
//       Bucket: 'raw-videos-bucket-vivam',
//       Key: inputS3Key,
//     }).promise();
//     fs.writeFileSync(inputPath, file.Body);
//     console.log(" Video downloaded and saved locally:", inputPath);

//     // Step 2: Create output folder if not exists
//     if (!fs.existsSync(outputFolder)) {
//       fs.mkdirSync(outputFolder);
//     }

// // Step into dash-output dir so all files go there
// process.chdir(outputFolder); //  now all output files are written here

// await new Promise((resolve, reject) => {
//   // ffmpeg(inputPath)
//   //   .addOutputOptions([
//   //     '-preset veryfast',
//   //     '-g 48',
//   //     '-sc_threshold 0',
//   //     '-map 0:v:0',
//   //     '-map 0:a:0',
//   //     '-b:v:0 800k',
//   //     '-s:v:0 640x360',
//   //     '-b:v:1 1400k',
//   //     '-s:v:1 842x480',
//   //     '-b:v:2 2800k',
//   //     '-s:v:2 1280x720',
//   //     '-b:a 128k',
//   //     '-f dash',
//   //     '-seg_duration 4',
//   //     '-use_template 1',
//   //     '-use_timeline 1',
//       // '-init_seg_name', 'init-$RepresentationID$.m4s',   // filename only
//       // '-media_seg_name', 'chunk-$RepresentationID$-$Number$.m4s', //  filename only
//   //   ])
//     ffmpeg(inputPath)
//     // .complexFilter([
//     //   '[0:v]split=3[v1][v2][v3]; [v1]scale=640:360[v360]; [v2]scale=842:480[v480]; [v3]scale=1280:720[v720]'
//     // ])
//     // .outputOptions([
//     //   '-map [v360]', '-b:v:0 800k',
//     //   '-map [v480]', '-b:v:1 1400k',
//     //   '-map [v720]', '-b:v:2 2800k',
//     //   '-map 0:a:0', '-b:a 128k',
//     //   '-preset veryfast',
//     //   '-g 48',
//     //   '-sc_threshold 0',
//     //   '-f dash',
//     //   '-seg_duration 4',
//     //   '-use_template 1',
//     //   '-use_timeline 1',
//       // '-init_seg_name', path.join(outputFolder, 'init-$RepresentationID$.m4s'),
//       // '-media_seg_name', path.join(outputFolder, 'chunk-$RepresentationID$-$Number$.m4s'),
//        .complexFilter([
//     '[0:v]split=3[v1][v2][v3]; [v1]scale=256:144[v144]; [v2]scale=640:360[v360]; [v3]scale=1280:720[v720]'
//   ])
//   .outputOptions([
//     '-map [v144]', '-b:v:0 300k',
//     '-map [v360]', '-b:v:1 800k',
//     '-map [v720]', '-b:v:2 2800k',
//     '-map 0:a:0', '-b:a 128k',
//     '-preset veryfast',
//     '-g 64',                   // GOP = framerate * segment size (8s * 8fps)
//     '-sc_threshold 0',
//     '-f dash',
//     '-seg_duration 8',        // segment duration set to 8 seconds
//     '-use_template 1',
//     '-use_timeline 1',
//             '-init_seg_name', 'init-$RepresentationID$.m4s',   //  filename only
//       '-media_seg_name', 'chunk-$RepresentationID$-$Number$.m4s', //  filename only
//     ])
//     .output('output.mpd') //  filename only
//     .on('start', (cmdLine) => {
//       console.log(' FFmpeg command:', cmdLine);
//     })
//      .on('progress', (p) => console.log(` Progress: ${p.timemark}`))
//     .on('end', () => {
//       console.log(' FFmpeg finished successfully.');
//       resolve();
//     })
//     .on('error', (err) => {
//       console.error(' FFmpeg error:', err);
//       reject(err);
//     })
//     .run(); //  no { cwd }
// });

//     console.log(" DASH conversion complete.");

//     // Step 4: Upload all files in outputFolder to S3
//     const files = fs.readdirSync(outputFolder);
//     console.log(" Files to upload:", files);

//     await Promise.all(files.map(async (file) => {
//       console.log("main chiz",file);
//       console.log("output folder",outputFolder)
//       const filePath = path.join(outputFolder, file);
//       console.log("main filepaath",filePath)
//       const fileContent = fs.readFileSync(filePath);
//       console.log("file content",fileContent)
//       const contentType = file.endsWith('.mpd')
//         ? 'application/dash+xml'
//         : 'video/iso.segment';
//       console.log("contentType",contentType)
//       const uploadParams = {
//         Bucket: 'processed-videos-movieverse',
//         // Key: `dash/${file}`,
//         Key: `dash/${movieId}_${originalFullName}/${file}`,
//         Body: fileContent,
//         ContentType: contentType,
//       };
//       console.log("upload params",uploadParams)
//       const result = await s3.upload(uploadParams).promise();
//       console.log(` Uploaded: ${file} → ${result.Location}`);
//     }));

//     // Step 5: Cleanup temp files
//     // fs.unlinkSync(inputPath);
//     // fs.rmSync(outputFolder, { recursive: true, force: true });
//     fs.unlinkSync(inputPath);

// // setTimeout(() => {
// //   try {
// //     fs.rmSync(outputFolder, { recursive: true, force: true });
// //     console.log(" Cleanup complete.");
// //   } catch (cleanupErr) {
// //     console.error(" Cleanup failed:", cleanupErr);
// //   }
// // }, 2000); // wait 1 second

//     // console.log(" Cleanup complete.");

//     // Step 6: Respond to client

// const mpdUrl = `https://processed-videos-movieverse.s3.ap-south-1.amazonaws.com/dash/${movieId}_${originalFullName}/output.mpd`;

//  console.log(
//       'Before update:',
//       await StreamingMoviesModel.findOne({ movieId }).lean()
//     );

//     // 5) Do the update
//     const result = await StreamingMoviesModel.updateOne(
//       { movieId },
//       { $set: { s3UploadProcessedLink: mpdUrl } }
//     );
//      console.log(
//       'After update:',
//       await StreamingMoviesModel.findOne({ movieId }).lean()
//     );
// // await StreamingMoviesModel.updateOne(
// //   { movieId },
// //   { $set: { s3uploadProcessedLink: mpdUrl } }
// // );

// console.log(" s3uploadProcessedLink updated in DB.");
//     res.status(200).json({
//       message: 'Conversion and upload successful',
//       mpdUrl: mpdUrl
//     });

//   } catch (err) {
//     console.error(' Error during video conversion:', err);
//     res.status(500).json({ error: 'Video conversion failed' });
//   }
// };

export const convertVideoJob = async (req, res) => {
  try {
    const { movieId, originalFullName } = req.body;
    if (!movieId) return res.status(400).json({ error: "movieId is required" });

    // 1. Get all jobs from Upstash Redis
    const allJobs = await getRedisVidepProcessingData();
    console.log("alljobs from redis in ConvertVideoJob::", allJobs);
    const job = allJobs.find((job) => job.fileName.startsWith(movieId));
    console.log("job from redis in ConvertVideoJob::", job);
    if (!job)
      return res.status(404).json({ error: "No job found for this movieId" });

    //2. update status to processing
    await StreamingMoviesModel.updateOne(
      { movieId },
      {
        $set: {
          status: "processing",
          s3UploadProcessedLink: null,
        },
      }
    );

    // 3. Run ECS Task with S3 input path
    const taskResult = await runECSTask({
      fileName:job.fileName,
      s3Path: job.s3Path,
      bucketName: job.bucketName,
      movieId,
    });

    // 4. After ECS job is done, delete from Redis
    //     await deleteRedisJob(job.fileName);
    const mpdUrl = `https://processed-videos-movieverse.s3.ap-south-1.amazonaws.com/dash/${movieId}_${originalFullName}/output.mpd`;

    console.log(
      "Before update:",
      await StreamingMoviesModel.findOne({ movieId }).lean()
    );

    // 5) After updating
    const result = await StreamingMoviesModel.updateOne(
      { movieId },
      { $set: { s3UploadProcessedLink: mpdUrl, status: "processed" } }
    );
    console.log(
      "After update:",
      await StreamingMoviesModel.findOne({ movieId }).lean()
    );

    // res.status(200).json({
    //   message: "Conversion and upload successful",
    //   mpdUrl: mpdUrl,
    // });
    return res.status(200).json({ message: "ECS task started",mpdUrl: mpdUrl, });
  } catch (err) {
    console.error(" Error in convertVideo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
