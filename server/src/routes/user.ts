import express, { NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
import { IUser, UserModel } from "../model/user";
import { UserErrors } from "../common/errors";

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (user) {
            return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS })

        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();
        res.json({ message: "User Registered Successfully" })
    }
    catch (err) {
        res.status(500).json({ type: err })
    }


})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user: IUser = await UserModel.findOne({ username });

        if (!user) {
            return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ token, userID: user._id });
    } catch (err) {
        return res.status(500).json({ type: err });
    }
});

// export const verifyToken = async (req, res, next) => {

//     const authHeader = req.headers.authorization;
//     if (authHeader) {
//         jwt.verify(authHeader, "secret", (err) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             next();
//         });

//     }
//     else {
//         res.sendStatus(401)
//     }
// };




export { router as userRouter }