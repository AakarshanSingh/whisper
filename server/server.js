import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { app, server } from './socket/socket.js';
import connectDB from './database/connectDB.js';

import authRoutes from './routes/authRoute.js';
import messageRoutes from './routes/messageRoute.js';
import userRoutes from './routes/userRoutes.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const PORT = process.env.PORT || 8000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors({
  origin: '*', 
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
