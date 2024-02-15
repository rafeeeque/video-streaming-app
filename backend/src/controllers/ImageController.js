import Image from "../models/Image.js";
import fs from "fs";
import { send } from '../email.js'

export const uploadImage = async (req, res) => {
  // console.log(req.email, 'email')

  try {
    // Check if binary data exists in request body
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: "No image provided" });
    }

    const imageFile = req.files[0]; // Access the first file object from req.files
    // Generate a unique filename for the image
    const filename = `${Date.now()}.png`;
    const imagePath = `images/${filename}`;

    // Write the image data to a file
    fs.writeFileSync(`uploads/images/${filename}`, imageFile.buffer, "binary");
    // Save image information to the database
    const image = new Image({
      filename: filename,
      user: req.userId,
      path: imagePath,
    });
    await image.save();
    // try {
    //   const imageData = fs.readFileSync(`uploads/images/${filename}`);
    //   const base64Image = imageData.toString('base64');
    //   await send('rafeequekhp134@gmail.com', base64Image, filename)
    // } catch (err) {
    //   console.error(err);
    // }
    // // Respond with success message
    res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllImages = async (req, res) => {
  let where = {};
  if (req.query.where) {
    try {
      where = JSON.parse(req.query.where);
    } catch (e) {
      where = req.query.where;
    }
  }
  const userId = req.userId;

  try {
    // Retrieve all images for the logged-in user
    const images = await Image.find({ user: userId, ...where }).populate(
      "user",
      "name"
    ).sort({ createdAt: -1 });

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
