import express from "express";

const router = express.Router();

const generatePrefix = () => {
    const random64BitHexCode = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return random64BitHexCode;
};

router.post('/', (req, res) => {
    const clientSecret = req.body;
    console.log(clientSecret);
    const serverSecret = process.env.LOGIN_SECRET;

    if (clientSecret.code !== serverSecret) {
        return res.status(422).send({ message: 'Invalid Secret Code!' });
    }

    res.status(200).send({ message: 'Secret Matched!', urlPrefix: generatePrefix() });
});

export default router;