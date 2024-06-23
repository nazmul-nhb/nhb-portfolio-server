import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import emailRoutes from "./routes/email.js";

dotenv.config();

// Middlewares
const app = express();
const port = process.env.PORT || 5000;


// Routes
app.use('/email', emailRoutes);



app.get("/", async (req, res) => {
    res.send("Portfolio Server is Running!");
});

app.listen(port, () => {
    console.log(`Portfolio Server is Running on Port: ${port}`);
});