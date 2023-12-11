import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload from jsonwebtoken

import { UserModel } from '../model/user';

export const protect = async (req, res, next) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Specify the type of decoded explicitly
            const decoded: JwtPayload | string = jwt.verify(token, process.env.JWT_SECRET);

            if (typeof decoded === 'string') {
                throw new Error("Not authorized, token failed");
            }

            req.user = await UserModel.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
};