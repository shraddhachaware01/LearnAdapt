
import questions from "./question.js";

function checkAnswer(question, userAnswer) {
  return question.correctAnswer === userAnswer;
}

function getPercentage(correct, total) {
  if (total === 0) return 0;
  return Number(((correct / total) * 100).toFixed(2));
}

function getLevel(percent) {
  if (percent < 50) return "weak";
  if (percent < 80) return "medium";
  return "strong";
}

const prerequisites = {
  "promise-basics": [],
  "promise-states": ["promise-basics"],
  "then-catch": ["promise-states"],
  "async-await": ["then-catch"],
  "error-handling": ["then-catch"]
};

function calculateScores(questions, userAnswers) {
  const scores = {};

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const concept = question.concept;

    if (!scores[concept]) {
      scores[concept] = { correct: 0, total: 0 };
    }

    scores[concept].total++;

    if (checkAnswer(question, userAnswers[i])) {
      scores[concept].correct++;
    }
  }

  return scores;
}

function getWeakConcepts(scores) {
  const weakConcepts = [];

  for (const concept in scores) {
    const { correct, total } = scores[concept];
    const percentage = getPercentage(correct, total);

    if (getLevel(percentage) === "weak") {
      weakConcepts.push(concept);
    }
  }

  return weakConcepts;
}

function generateRoadmap(scores) {
  const roadmap = [];
  const addedConcepts = new Set();

  function addConcept(concept) {
    if (!scores[concept] || addedConcepts.has(concept)) return;

    const { correct, total } = scores[concept];
    const level = getLevel(getPercentage(correct, total));

    if (level === "strong") return;

    for (const required of prerequisites[concept] || []) {
      addConcept(required);
    }

    if (!addedConcepts.has(concept)) {
      addedConcepts.add(concept);
      roadmap.push(concept);
    }
  }

  // Weak concepts first
  for (const concept in scores) {
    const { correct, total } = scores[concept];

    if (getLevel(getPercentage(correct, total)) === "weak") {
      addConcept(concept);
    }
  }

  // Medium concepts next
  for (const concept in scores) {
    const { correct, total } = scores[concept];

    if (getLevel(getPercentage(correct, total)) === "medium") {
      addConcept(concept);
    }
  }

  return roadmap;
}

const students = [
  {
    name: "Student 1: Weak in Promise Basics and Promise States",
    answers: [
      "CSS style", "A loop", "A CSS style",
      "Start, run, stop", "Fulfilled", "Always",
      ".then()", ".catch()", "The fulfillment value",
      "async",
      "Waits for a Promise's result before continuing that function",
      "A Promise", "try...catch", "In the catch block", ".catch()"
    ]
  },
  {
    name: "Student 2: Weak in Then & Catch",
    answers: [
      "A future result", ".then()", ".map()",
      "Pending, fulfilled, rejected", "Pending", "Never",
      ".map()", ".push()", "The HTML document",
      "async",
      "Waits for a Promise's result before continuing that function",
      "A Promise", "try...catch", "In the catch block", ".catch()"
    ]
  },
  {
    name: "Student 3: Strong in Every Concept",
    answers: [
      "A future result", ".then()", ".catch()",
      "Pending, fulfilled, rejected", "Pending", "Never",
      ".then()", ".catch()", "The fulfillment value",
      "async",
      "Waits for a Promise's result before continuing that function",
      "A Promise", "try...catch", "In the catch block", ".catch()"
    ]
  }
];

for (const student of students) {
  const scores = calculateScores(questions, student.answers);

  console.log(`\n--- ${student.name} ---`);

  for (const concept in scores) {
    const { correct, total } = scores[concept];
    const percentage = getPercentage(correct, total);

    console.log(
      `${concept}: ${correct}/${total} (${percentage}%) - ${getLevel(percentage)}`
    );
  }

  console.log("Weak concepts:", getWeakConcepts(scores));
  console.log("Personalized roadmap:", generateRoadmap(scores));
}