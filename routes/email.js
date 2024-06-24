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
            text: `New Message from ${name} (${email}):\n\n${msg}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #004085;">New Message from ${name}</h2>
                    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #004085;">${email}</a></p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <h3 style="color: #004085;">Message:</h3>
                    <p style="white-space: pre-wrap; background-color: #f8f9fa; padding: 10px; border-left: 4px solid #004085;">${msg}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        // confirmation email to the sender
        const confirmationMailOptions = {
            from: `Nazmul Hassan <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank You for Contacting Me',
            text: `Hi, ${name},\n\nThank you for reaching out. I have received your message and will get back to you soon.
            \n\nBest Regards,\nNazmul Hassan
            \n\n
            ---------------------------------
            \n\nYour Message:\n\n${msg}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #004085;">Hi, ${name},</h2>
                    <p>Thank you for reaching out. I have received your message and will get back to you soon.</p>
                    <br><br>
                    <p>Best Regards,</p>
                    <p><strong>Nazmul Hassan</strong></p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <h3 style="color: #004085;">Your Message:</h3>
                    <p style="white-space: pre-wrap; background-color: #f8f9fa; padding: 10px; border-left: 4px solid #004085;">${msg}</p>
                </div>
            `
        };

        await transporter.sendMail(confirmationMailOptions);

        res.status(200).send({ message: 'Message Sent Successfully!' });
    } catch (error) {
        console.error('Error Sending Mail: ', error);
        res.status(500).send(error.toString());
    }
});

export default router;
