import express from 'express';
import multer from "multer";
import * as videoController from '../controllers/VideoController.js';
import * as imageController from '../controllers/ImageController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.use(verifyToken);

router.post('/video/upload', videoController.uploadVideoStreaming);
router.get('/videos', videoController.getAllVideos);

router.post('/image/upload', imageController.uploadImage);
router.get('/images', imageController.getAllImages);

export default router;
