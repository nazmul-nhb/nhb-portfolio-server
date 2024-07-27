import express from "express";
import { verifyToken, verifyOwner } from "../middlewares/auth.js";
import { bioCollection } from "../db/portfolioDB.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// get bio
router.get('/', async (req, res) => {
    try {
        const result = await bioCollection.findOne({});

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});

// update bio
router.patch('/update/:id', verifyToken, verifyOwner, async (req, res) => {
    try {
        const filter = { _id: new ObjectId(req.params.id) };
        const updatedBio = { $set: req.body }
        const options = { upsert: true };
        const result = await bioCollection.updateOne(filter, updatedBio, options);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error!");
    }
});


export default router;