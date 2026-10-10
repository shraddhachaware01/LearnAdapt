
import questions from "./question.js";

function checkAnswer(question, userAnswer) {
  return question.correctAnswer === userAnswer;
}

const userAnswers = [
  "A future result",
  ".then()",
  ".map()",
  "Pending, fulfilled, rejected",
  "Pending",
  "Never",
  ".then()",
  ".catch()",
  "The fulfillment value",
  "async",
  "Waits for a Promise's result before continuing that function",
  "A Promise",
  "try...catch",
  "In the catch block",
  ".catch()"
];

function calculateScores(questions, userAnswers) {
  const scores = {};

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = userAnswers[i];
    const concept = question.concept;

    if (!scores[concept]) {
      scores[concept] = {
        correct: 0,
        total: 0
      };
    }

    scores[concept].total += 1;

    if (checkAnswer(question, userAnswer)) {
      scores[concept].correct += 1;
    }
  }

  return scores;
}

console.log(calculateScores(questions, userAnswers));
