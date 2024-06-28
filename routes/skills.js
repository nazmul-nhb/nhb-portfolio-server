import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { skillCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";
const router = express.Router();

// get all skills
router.get('/', async (req, res) => {
    const result = await skillCollection.find().sort({ serial: 1 }).toArray();

    res.send(result)
});

// update a skill
router.patch('/update/:id', async (req, res) => {
    const filter = { _id: new ObjectId(req.params.id) };
    const updatedSkill = { $set: req.body }
    const options = { upsert: true };
    const result = await skillCollection.updateOne(filter, updatedSkill, options);

    res.send(result)
});



export default router;