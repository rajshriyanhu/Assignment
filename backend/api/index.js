import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import cookieparser from "cookie-parser";
import authRouter from './routes/auth.js';
import fileRouter from './routes/file.js';
import folderRouter from './routes/folder.js'
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))

app.listen(7000, () => {
  console.log("Server is running on port 7000!");
});

app.use('/api/auth', authRouter)
app.use('/api/file', fileRouter)
app.use('/api/folder', folderRouter)