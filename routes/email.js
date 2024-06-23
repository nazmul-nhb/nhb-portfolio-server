import express from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// OAuth2 configuration
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

router.get('/test', (req, res) => {
    res.send('Email is waiting here!');
});

router.post('/send', async (req, res) => {
    try {
        const { name, email, msg } = req.body;

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // email to self
        const mailOptions = {
            from: `Nazmul Hassan <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Message from ${name}`,
            text: `New Message from ${name} (${email}):\n\n${msg}`
        };

        await transporter.sendMail(mailOptions);

        // confirmation email to the sender
        const confirmationMailOptions = {
            from: `Nazmul Hassan <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank You for Contacting Me',
            text: `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you soon.
            \n\nBest Regards,\nNazmul Hassan
            \n\n\n<Your Message>:\n\n${msg}`
        };

        await transporter.sendMail(confirmationMailOptions);

        res.status(200).send({message: 'Messages Sent Successfully!'});
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send(error.toString());
    }
});

export default router;
