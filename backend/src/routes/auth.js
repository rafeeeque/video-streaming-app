import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', authController.facebookAuthCallback);

router.get('/auth/linkedin', authController.linkedinAuth);
router.get('/auth/linkedin/callback', authController.linkedinAuthCallback);

export default router;