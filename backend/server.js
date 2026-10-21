
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const QuizResult = require('./models/QuizResult');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('LearnAdapt AI backend is running! 💜');
});

// API information
app.get('/api', (req, res) => {
  res.json({
    project: 'LearnAdapt AI',
    description: 'An adaptive learning platform',
    status: 'Backend is running',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LearnAdapt AI API is working!',
  });
});

// Save a quiz result
app.post('/api/quiz-results', async (req, res) => {
  try {
    const quizResult = new QuizResult(req.body);
    const savedResult = await quizResult.save();

    res.status(201).json({
      success: true,
      message: 'Quiz result saved successfully!',
      data: savedResult,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not save quiz result.',
      error: error.message,
    });
  }
});

// Retrieve all quiz results
app.get('/api/quiz-results', async (req, res) => {
  try {
    const results = await QuizResult.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not retrieve quiz results.',
      error: error.message,
    });
  }
});

// Start server after connecting to MongoDB
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Atlas connected successfully! 💜');

    app.listen(PORT, () => {
      console.log(
        `LearnAdapt AI server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
