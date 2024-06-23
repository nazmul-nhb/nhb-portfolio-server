import express from "express";


const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Email is waiting Here!');
});




export default router