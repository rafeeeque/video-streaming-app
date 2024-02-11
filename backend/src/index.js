import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import cookieParser from 'cookie-parser';
// import passport from './passport.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

console.log('process.env.DB_URL', process.env.DB_URL)
const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.DB_URL || 'mongodb://localhost:27017/video_streaming_app';
const upload = multer();

const uploadsDirectory = path.join(process.cwd(), 'uploads')
fs.existsSync(uploadsDirectory) || fs.mkdirSync(uploadsDirectory, { recursive: true, mode: 0o777 })

const videosDirectory = path.join(uploadsDirectory, 'videos')
fs.existsSync(videosDirectory) || fs.mkdirSync(videosDirectory, { recursive: true, mode: 0o777 })

const imagesDirectory = path.join(uploadsDirectory, 'images')
fs.existsSync(imagesDirectory) || fs.mkdirSync(imagesDirectory, { recursive: true, mode: 0o777 })

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use body parser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware
app.use(express.json());

// Middleware to parse multipart/form-data
app.use(upload.any());

// Configure cookie parser middleware
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());

// Enable CORS for all routes
app.use(cors({
  origin: true,
  credentials: true
}));

// Routes
app.use('/', authRoutes);
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
