
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const QuizResult = require('./models/QuizResult');
const PracticeResult = require('./models/PracticeResult');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for local development and deployment
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  })
);

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

// Save a diagnostic quiz result
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

// Retrieve all diagnostic quiz results
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

// Allowed practice concepts
const validPracticeConcepts = [
  'promise-basics',
  'promise-states',
  'then-catch',
  'async-await',
  'error-handling',
];

// Save a practice result
app.post('/api/practice-results', async (req, res) => {
  try {
    const {
      concept,
      score,
      totalQuestions,
      percentage,
      answers,
    } = req.body;

    if (
      !validPracticeConcepts.includes(concept) ||
      !Number.isInteger(score) ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1 ||
      score < 0 ||
      score > totalQuestions ||
      !Array.isArray(answers) ||
      answers.length !== totalQuestions ||
      !answers.every(
        (answer) =>
          Number.isInteger(answer.questionIndex) &&
          Number.isInteger(answer.selectedAnswer) &&
          typeof answer.correct === 'boolean'
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid practice result data.',
      });
    }

    // Verify score and percentage
    const actualScore = answers.filter(
      (answer) => answer.correct
    ).length;

    const calculatedPercentage = Math.round(
      (score / totalQuestions) * 100
    );

    if (
      actualScore !== score ||
      percentage !== calculatedPercentage
    ) {
      return res.status(400).json({
        success: false,
        message: 'Score or percentage does not match the answers.',
      });
    }

    // Save to MongoDB
    const savedResult = await new PracticeResult({
      concept,
      score,
      totalQuestions,
      percentage: calculatedPercentage,
      answers,
    }).save();

    return res.status(201).json({
      success: true,
      message: 'Practice result saved successfully!',
      data: savedResult,
    });
  } catch (error) {
    console.error('Save practice result error:', error);

    return res.status(500).json({
      success: false,
      message: 'Could not save practice result.',
    });
  }
});

// Retrieve all practice results
app.get('/api/practice-results', async (req, res) => {
  try {
    const results = await PracticeResult.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Retrieve practice results error:', error);

    return res.status(500).json({
      success: false,
      message: 'Could not retrieve practice results.',
    });
  }
});

// Start server after connecting to MongoDB
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing.');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Atlas connected successfully! 💜');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`LearnAdapt AI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
