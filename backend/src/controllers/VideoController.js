import fs from "fs";
import Video from "../models/Video.js";

// Handle the POST request for uploading video data
export const uploadVideoStreaming = async (req, res) => {
  try {
    // Check if binary data exists in request body
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: "No video data provided" });
    }

    const videoFile = req.files[0]; // Access the first file object from req.files
    // Generate a unique filename for the video
    const filename = `${Date.now()}.webm`;
    const videoPath = `videos/${filename}`;

    // Write the video data to a file
    fs.writeFileSync(`uploads/videos/${filename}`, videoFile.buffer, "binary");

    // Save video information to the database (assuming you have a Video model)
    const video = new Video({
      filename: filename,
      user: req.userId,
      path: videoPath
    });
    await video.save();

    // // Respond with success message
    res.status(200).json({ message: "Video uploaded successfully" });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllVideos = async (req, res) => {
    const userId = req.userId;
  
    try {
      // Retrieve all videos for the logged-in user
      const videos = await Video.find({ user: userId }).sort({ createdAt: -1 });
  
      res.status(200).json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
