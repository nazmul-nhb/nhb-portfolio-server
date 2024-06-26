import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { projectCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";
const router = express.Router();

// get all projects
router.get('/', async (req, res) => {
    const result = await projectCollection.find().toArray();

    res.send(result)
});



export default router;