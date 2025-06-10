import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
const app = express();
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/user.route.js';

const port = process.env.PORT || 4000;

await connectDB();
const allowedOrigins = ['http://localhost:5173'];
//Middleware Configuration

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get('/', (req, res) => res.send('API is Working'));
app.use('/api/user', userRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
