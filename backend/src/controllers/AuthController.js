import passport from '../passport.js';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'MyS3cr3tK3Y';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

export const googleAuth = (req, res) => {
    try {

        // Generate authentication URL
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile']
        });

        // Respond with authentication URL
        res.json({ authUrl });
    } catch (error) {
        console.error('Error generating Google authentication URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const googleAuthCallback = async (req, res, next) => {
    const code = req.query.code;
    
    try {
        // Exchange authorization code for access token
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2', // Use the appropriate version
        });
        
        // Get user info from Google
        const userInfo = await oauth2.userinfo.get({ auth: oauth2Client });
        const googleId = userInfo.data.id;
        const email = userInfo.data.email;
        const name = userInfo.data.name;
        
        // Check if the user exists in your database
        let user = await User.findOne({ googleId });
        
        if (!user) {
            // If user doesn't exist, create a new user in the database
            user = new User({
                name,
                googleId,
                email
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

        // Set JWT token as a cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // Max age in milliseconds (1 hour)
        res.cookie('name', name, { httpOnly: false, maxAge: 3600000 });
        
        // Redirect user to the home page or any desired URL
        res.redirect(process.env.VUE_APP_BASE_URL + 'home?token=' + token);
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const facebookAuth = passport.authenticate('facebook');
export const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: '/' }, (req, res) => {
  // Successful Facebook authentication callback
  res.redirect('/');
});

export const linkedinAuth = passport.authenticate('linkedin');
export const linkedinAuthCallback = passport.authenticate('linkedin', { failureRedirect: '/' }, (req, res) => {
  // Successful LinkedIn authentication callback
  res.redirect('/');
});