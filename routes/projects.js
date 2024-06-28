import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { projectCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";
const router = express.Router();

// get all projects
router.get('/', async (req, res) => {
    const result = await projectCollection.find().sort({ serial: 1 }).toArray();

    res.send(result)
});

// update a project
router.patch('/update/:id', verifyToken, verifyOwner, async (req, res) => {
    const filter = { _id: new ObjectId(req.params.id) };
    const updatedProject = { $set: req.body }
    const options = { upsert: true };
    const result = await projectCollection.updateOne(filter, updatedProject, options);

    res.send(result)
});


export default router;