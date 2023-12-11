import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import connectDB from './config/db';
import dotenv from "dotenv";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";


const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/products", productRouter);



app.listen(5000, () => console.log("Running on 5000"));