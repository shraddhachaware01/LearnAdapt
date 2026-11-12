
const mongoose = require('mongoose');

const practiceResultSchema = new mongoose.Schema(
  {
    concept: {
      type: String,
      required: true,
      enum: [
        'promise-basics',
        'promise-states',
        'then-catch',
        'async-await',
        'error-handling',
      ],
    },

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

    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },

        selectedAnswer: {
          type: Number,
          required: true,
        },

        correct: {
          type: Boolean,
          required: true,
        },

        timeTakenSeconds: {
          type: Number,
          min: 0,
          default: 0,
        },

        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
        },

        gapType: {
          type: String,
          enum: ['conceptual', 'logical', 'application'],
        },

        skill: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PracticeResult', practiceResultSchema);
