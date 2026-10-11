
import questions from "./question.js";

function checkAnswer(question, userAnswer) {
  return question.correctAnswer === userAnswer;
}

function getPercentage(correct, total) {
  if (total === 0) {
    return 0;
  }

  return Number(((correct / total) * 100).toFixed(2));
}

function getLevel(percent) {
  if (percent < 50) {
    return "weak";
  } else if (percent < 80) {
    return "medium";
  } else {
    return "strong";
  }
}

function getWeakConcepts(scores) {
  const weakConcepts = [];

  for (const concept in scores) {
    const correct = scores[concept].correct;
    const total = scores[concept].total;
    const percentage = getPercentage(correct, total);
    const level = getLevel(percentage);

    if (level === "weak") {
      weakConcepts.push(concept);
    }
  }

  return weakConcepts;
}


const userAnswers = [
  "CSS style",
  "A loop",
  "A CSS style",
  "Start, run, stop",
  "Fulfilled",
  "Always",
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
      scores[concept] = { correct: 0, total: 0 };
    }

    scores[concept].total += 1;

    if (checkAnswer(question, userAnswer)) {
      scores[concept].correct += 1;
    }
  }

  return scores;
}

const scores = calculateScores(questions, userAnswers);

for (const concept in scores) {
  const correct = scores[concept].correct;
  const total = scores[concept].total;
  const percentage = getPercentage(correct, total);
  const level = getLevel(percentage);

  console.log(`${concept}: ${percentage}% - ${level}`);
}

console.log("Weak concepts:", getWeakConcepts(scores));

const prerequisites = {
  "promise-basics": [],
  "promise-states": ["promise-basics"],
  "then-catch": ["promise-states"],
  "async-await": ["then-catch"],
  "error-handling": ["then-catch"]
};

console.log("Prerequisites:", prerequisites);
