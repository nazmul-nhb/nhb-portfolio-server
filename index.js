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

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://nazmul-nhb.web.app',
    'https://nazmul-nhb.vercel.app',
    'https://nazmul-nhb.firebaseapp.com',
    'https://nazmul-nhb-nazmul-hassans-projects.vercel.app',
    'https://nazmul-nhb-nazmul-nhb-nazmul-hassans-projects.vercel.app'
];

// make dynamic link for every vercel deployment
const dynamicOriginPattern = /^https:\/\/nazmul-[a-z0-9]+-nazmul-hassans-projects\.vercel\.app$/;

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || dynamicOriginPattern.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS!'));
        }
    }
};

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
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

// error handler for 404
app.use((req, res, next) => {
    const error = new Error("Requested URL Not Found!");
    error.status = 404;
    next(error);
});

// final error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).send({
        message: error.message || "Internal Server Error!",
    });
});

const run = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Portfolio Server is Running on Port: ${port}`);
    });
};

run().catch(console.dir);