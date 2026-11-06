
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const QuizResult = require('./models/QuizResult');
const PracticeResult = require('./models/PracticeResult');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
    ];

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

// Save diagnostic quiz result
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

// Retrieve diagnostic quiz results
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

// Save practice result
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

// Retrieve practice results
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

// Python AI performance analysis endpoint
app.post('/api/analyze-performance', async (req, res) => {
  try {
    const response = await fetch(
      'http://127.0.0.1:8001/analyze',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Python AI analysis failed.',
        error: result.detail || result.message,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Python AI service error:', error.message);

    return res.status(503).json({
      success: false,
      message: 'Python AI service is unavailable.',
    });
  }
});

// NEW: Save Python AI analysis to an existing quiz result
app.patch('/api/quiz-results/:id/ai-analysis', async (req, res) => {
  try {
    const { aiAnalysis } = req.body;

    if (
      !aiAnalysis ||
      typeof aiAnalysis !== 'object' ||
      Array.isArray(aiAnalysis)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid AI analysis data is required.',
      });
    }

    const updatedResult = await QuizResult.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          aiAnalysis,
          weakConcepts: aiAnalysis.weak_concepts || [],
          roadmap: aiAnalysis.roadmap || [],
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedResult) {
      return res.status(404).json({
        success: false,
        message: 'Quiz result not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'AI analysis saved successfully!',
      data: updatedResult,
    });
  } catch (error) {
    console.error('AI analysis update error:', error);

    return res.status(500).json({
      success: false,
      message: 'Could not save AI analysis.',
      error: error.message,
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
