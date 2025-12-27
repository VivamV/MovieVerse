import { StreamingMoviesModel } from "../models/streamingSchema.js";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({ region: "ap-south-1" });

export const runECSTask = async ({ fileName, s3Path, bucketName, movieId }) => {
  console.log("inside runECSTask Controller:", fileName, s3Path, bucketName);
  const params = {
    cluster: "ffmpeg-cluster",
    launchType: "FARGATE",
    taskDefinition: "ffmpeg-worker-task",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: ["subnet-0103834e34c17bfb2"],
        assignPublicIp: "ENABLED",
        securityGroups: ["sg-01329b76b6aebbb8d"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "ffmpeg-worker-container",
          environment: [
            { name: "MOVIE_ID", value: movieId },
            {
              name: "REDIS_URL",value:process.env.REDIS_URL,
            },
            { name: "AWS_ACCESS_KEY_ID", value: process.env.AWS_ACCESS_KEY_ID },
            {
              name: "AWS_SECRET_ACCESS_KEY", value: process.env.AWS_SECRET_ACCESS_KEY,
            },
            { name: "AWS_REGION", value: "ap-south-1" },
            // {name: 'MOVIEVERSE_UI_BASE_URL', value: 'http://host.docker.internal:4000' }
          ],
        },
      ],
    },
  };
  console.log("Inside runECSTask:");
  const command = new RunTaskCommand(params);
  console.log("Inside runECSTask command:", command);
  const result = await ecsClient.send(command);
  console.log("Inside runECSTask result:", result);
  return result;
};

export const ecsCallback = async (req, res) => {
  try {
    const { movieId, success, fileName } = req.body;
    console.log("req.body in ecs callback", req.body);
    if (!success) {
      console.error(` FFmpeg task failed for ${movieId}`);

      await StreamingMoviesModel.updateOne(
        { movieId },
        {
          $set: {
            s3UploadProcessedLink: null,
            status: "failed",
          },
        }
      );
      return res.status(200).json({ error: "Conversion failed." });
    }

    const mpdUrl = `https://processed-videos-movieverse.s3.ap-south-1.amazonaws.com/dash/${fileName}/output.mpd`;

    // await deleteRedisJob(fileName);
    await StreamingMoviesModel.updateOne(
      { movieId },
      {
        $set: {
          s3UploadProcessedLink: mpdUrl,
          status: "processed",
        },
      }
    );

    res.status(200).json({ message: "DB updated after ECS completion" });
  } catch (err) {
    console.error(" Error during ecs callback:", err);
    res.status(500).json({ message: "Failed in ecs Callback" });
  }
};

export const getUploadedStreamData = async (req, res) => {
  try {
    const uploadedMovies = await StreamingMoviesModel.find().sort({
      createdAt: -1,
    });

    if (!uploadedMovies || uploadedMovies.length === 0) {
      return res.status(404).json({ message: "No uploaded movies found." });
    }

    res.status(200).json({
      message: "Uploaded movie data fetched successfully.",
      data: uploadedMovies,
    });
  } catch (error) {
    console.error("Error fetching uploaded movies:", error);
    res.status(500).json({ message: "Failed to fetch uploaded movies." });
  }
};
