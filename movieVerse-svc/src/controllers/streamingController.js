import { StreamingMoviesModel } from "../models/streamingSchema.js";

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
