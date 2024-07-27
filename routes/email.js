import express from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import moment from 'moment';
import { messageCollection } from '../db/portfolioDB.js';

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
            text: `New Message from ${name} - (${email}):\n\n${msg}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 4px 20px 8px 20px;">
                    <h3 style="color: #004085;">New Message from <span style="display: inline-block; color: #d9534f;">${name}</span></h3>
                    <p><a href="mailto:${email}" style="color: #004085;">${email}</a></p>
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
                <div style="font-family: Arial, sans-serif; color: #333; padding: 4px 20px 8px 20px;">
                    <h3 style="color: #004085;">Hi, <span style="display: inline-block; color: #d9534f;">${name},</span></h3>
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

        const incomingMsg = {
            sender: name, email, msg, views: 0, date: moment().format()
        };

        await messageCollection.insertOne(incomingMsg);

        res.status(200).send({ message: 'Message Sent Successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// get all email messages
router.get('/messages', async (req, res) => {
    try {
        const result = await messageCollection.find().toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// get single msg by id
router.get('/:id', async (req, res) => {
    const filter = { _id: new ObjectId(req.params.id) };
    const updateViewCount = { $inc: { views: 1 } };

    await messageCollection.updateOne(filter, updateViewCount);
    const result = await messageCollection.findOne(filter);
    res.send(result);
});


export default router;
