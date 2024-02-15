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
        let user = await User.findOne({ email });
        
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



export const linkedinAuth = (req, res) => {
    try {
        // Generate authentication URL
    
        const authUrl = `https://www.linkedin.com/uas/login?session_redirect=${process.env.LINKEDIN_CALLBACK_URL}?app_id=${process.env.LINKEDIN_CLIENT_ID}&auth_type=AC&flow={"state":"linkedin_1707978544357","scope":"r_emailaddress r_liteprofile","appId":${process.env.LINKEDIN_CLIENT_ID},"authorizationType":"OAUTH2_AUTHORIZATION_CODE","currentStage":"LOGIN_SUCCESS","currentSubStage":0,"authFlowName":"generic-permission-list","creationTime":1707978547015,"redirectUri":"${process.env.LINKEDIN_CALLBACK_URL}"}&fromSignIn=1&trk=oauth&cancel_redirect=${process.env.VUE_APP_BASE_URL}?app_id=${process.env.LINKEDIN_CLIENT_ID}&auth_type=AC&flow={"state":"linkedin_1707978544357","scope":"r_emailaddress r_liteprofile","appId":${process.env.LINKEDIN_CLIENT_ID},"authorizationType":"OAUTH2_AUTHORIZATION_CODE","currentStage":"LOGIN_SUCCESS","currentSubStage":0,"authFlowName":"generic-permission-list","creationTime":1707978547015,"redirectUri":"${process.env.LINKEDIN_CALLBACK_URL}"}`

        // Respond with authentication URL
        res.json({ authUrl });
    } catch (error) {
        console.error('Error generating LinkedIn authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const linkedinAuthCallback = async (req, res, next) => {
    try {
        // Obtain the authorization code from the request query parameters
        const code = req.query.code;
        
        // Use the authorization code to make a request to LinkedIn to exchange it for an access token
        const accessTokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            })
        });
        const accessTokenData = await accessTokenResponse.json();

         // Obtain the access token from the response
        const accessToken = accessTokenData.access_token;
        
        // Use the access token to fetch the user's information from LinkedIn
        const userInfoResponse = await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userInfo = await userInfoResponse.json();
        const linkedinId = userInfo.id;
        const email = userInfo.email;
        const name = userInfo.localizedFirstName + ' ' + userInfo.localizedLastName;
        
       // Check if the user exists in your database
       let user = await User.findOne({ email });
       
       if (!user) {
           // If user doesn't exist, create a new user in the database
           user = new User({
               name,
               linkedinId,
               email
            });
            await user.save();
        }
        
       // Generate JWT token
       const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

       // Set JWT token as a cookie
       res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
       res.cookie('name', name, { httpOnly: false, maxAge: 3600000 });
       
       // Redirect user to the home page or any desired URL
       res.redirect(process.env.VUE_APP_BASE_URL + 'home?token=' + token);
    } catch (error) {
        console.error('Error during LinkedIn authentication callback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const facebookAuthCallback = async (req, res, next) => {
    try {
        const { name, email, facebookId, accessToken } = req.body

                // Check if the user exists in your database
                let user = await User.findOne({ email });
        
                if (!user) {
                    // If user doesn't exist, create a new user in the database
                    user = new User({
                        name,
                        facebookId,
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
        console.error('Error generating Facebook authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const facebookAuth = passport.authenticate('facebook');

// export const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: '/' }, (req, res) => {
//   // Successful Facebook authentication callback
//   console.log(req, 'request')
//   res.redirect('/');
// });

// export const linkedinAuth = passport.authenticate('linkedin', { state: 'randomStateString', scope: ['r_emailaddress', 'r_liteprofile'] });
// export const linkedinAuthCallback = passport.authenticate('linkedin', { failureRedirect: '/' }, (req, res) => {
//   // Successful LinkedIn authentication callback
//   res.redirect('/');
// });