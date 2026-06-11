import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import overtimeRoutes from './routes/overtimeRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(
  morgan('dev', {
    stream: {
      write: (msg) => logger.http(msg.trim()),
    },
  })
);

// Home Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Attendance Management API is running successfully 🚀',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/overtime', overtimeRoutes);

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});