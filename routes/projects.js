import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { projectCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// get all projects
router.get('/', async (req, res) => {
    try {
        const result = await projectCollection.find().sort({ serial: 1 }).toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// add a new project
router.post('/add', verifyToken, verifyOwner, async (req, res) => {
    try {
        const project = req.body;

        // check for duplicate entries with project title
        const projectExists = await projectCollection.findOne({ title: project.title });
        if (projectExists) {
            return res.send({ message: 'Project Already Exists!' });
        }

        const result = await projectCollection.insertOne(project);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// update a project
router.patch('/update/:id', verifyToken, verifyOwner, async (req, res) => {
    try {
        const filter = { _id: new ObjectId(req.params.id) };
        const updatedProject = { $set: req.body };
        const options = { upsert: true };
        const result = await projectCollection.updateOne(filter, updatedProject, options);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// delete a project
router.delete('/delete/:id', verifyToken, verifyOwner, async (req, res) => {
    try {
        const filter = { _id: new ObjectId(req.params.id) };

        const result = await projectCollection.deleteOne(filter);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});


export default router;