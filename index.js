import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.js";

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
app.use('/email', emailRoutes);


app.get("/", async (req, res) => {
    res.send("Portfolio Server is Running!");
});

app.listen(port, () => {
    console.log(`Portfolio Server is Running on Port: ${port}`);
});