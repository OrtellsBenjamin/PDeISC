import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('API OnLearn)'));

app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);
app.use("/api/upload", uploadRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
