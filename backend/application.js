import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './cfg/db.js';

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    connectDB();
    console.log(`Running on port ${PORT}`);
});
