import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// verify token from the client side
export const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Unauthorized Access!' });
    }

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Unauthorized Access!' });
        }
        req.user = decoded;
        
        next();
    });
};

// verify if it's me! :D
export const verifyOwner = async (req, res, next) => {
    const user = req.user;
    // console.log('user in the middleware: ', user);
    if (!user || user?.email !== process.env.EMAIL_USER)
        return res.status(401).send({ message: 'Unauthorized Access!' });

    next();
};