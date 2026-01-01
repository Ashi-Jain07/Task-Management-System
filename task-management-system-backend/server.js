import express from 'express';
import cors from 'cors';
import { userRoutes } from './Routes/userRoutes.js';
import { taskRoutes } from './Routes/taskRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Task Management API is running!' });
});

userRoutes(app);
taskRoutes(app);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});