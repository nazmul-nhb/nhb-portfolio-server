import express from "express";

const router = express.Router();

router.post('/', (req, res) => {
    const clientSecret = req.body;
    const serverSecret = process.env.LOGIN_SECRET;

    if (clientSecret !== serverSecret) {
        return res.status(401).send({ message: 'Unauthorized Access!' });
    }

    res.status(200).send({ message: 'Secret Matched!' });
});

export default router;