import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { skillCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";
const router = express.Router();

// get all skills
router.get('/', async (req, res) => {
    const result = await skillCollection.find().toArray();

    res.send(result)
});



export default router;