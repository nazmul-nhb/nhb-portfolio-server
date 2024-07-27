import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { skillCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// get all skills
router.get('/', async (req, res) => {
    const result = await skillCollection.find().sort({ serial: 1 }).toArray();

    res.send(result);
});

// add a new skill
router.post('/add', verifyToken, verifyOwner, async (req, res) => {
    try {
        const skill = req.body;

        // check for duplicate entries with skill title
        const skillExists = await skillCollection.findOne({ title: skill.title });
        if (skillExists) {
            return res.send({ message: 'Skill Already Exists!' });
        }

        const result = await skillCollection.insertOne(skill);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// update a skill
router.patch('/update/:id', verifyToken, verifyOwner, async (req, res) => {
    try {
        const filter = { _id: new ObjectId(req.params.id) };
        const updatedSkill = { $set: req.body };
        const options = { upsert: true };
        const result = await skillCollection.updateOne(filter, updatedSkill, options);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// delete a skill
router.delete('/delete/:id', verifyToken, verifyOwner, async (req, res) => {
    try {
        const filter = { _id: new ObjectId(req.params.id) };

        const result = await skillCollection.deleteOne(filter);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});


export default router;