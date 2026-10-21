
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    conceptScores: {
      type: Map,
      of: Number,
      default: {},
    },

    learningLevel: {
      type: String,
      enum: ['Weak', 'Medium', 'Strong'],
      required: true,
    },

    weakConcepts: {
      type: [String],
      default: [],
    },

    roadmap: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
