import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import secretRoute from "./routes/secret.js"
import emailRoutes from "./routes/email.js";
import bioRoutes from "./routes/bio.js";
import skillsRoutes from "./routes/skills.js";
import projectsRoutes from "./routes/projects.js";
import { client, connectDB } from "./db/portfolioDB.js";

dotenv.config();

const corsOptions = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://nazmul-nhb.web.app',
    'https://nazmul-nhb.vercel.app',
    'https://nazmul-nhb.firebaseapp.com',
    'https://nazmul-nhb-nazmul-hassans-projects.vercel.app',
    'https://nazmul-nhb-nazmul-nhb-nazmul-hassans-projects.vercel.app'
];

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors({ origin: corsOptions }));
app.use(express.json());

// routes
app.use('/secret', secretRoute);
app.use('/bio', bioRoutes);
app.use('/skills', skillsRoutes);
app.use('/projects', projectsRoutes);
app.use('/email', emailRoutes);

app.get("/", async (req, res) => {
    res.send("Portfolio Server is Running!");
});

const run = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Portfolio Server is Running on Port: ${port}`);
    });
};

run().catch(console.dir);