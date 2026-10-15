
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
  const concepts = Object.keys(scores);

  function addConcept(concept) {
    if (!scores[concept] || addedConcepts.has(concept)) {
      return;
    }

    const { correct, total } = scores[concept];
    const percentage = getPercentage(correct, total);
    const level = getLevel(percentage);

    if (level === "strong") {
      return;
    }

    // Add prerequisites before the current concept.
    for (const required of prerequisites[concept] || []) {
      addConcept(required);
    }

    if (!addedConcepts.has(concept)) {
      addedConcepts.add(concept);
      roadmap.push(concept);
    }
  }

  // Add weak concepts first.
  for (const concept of concepts) {
    const { correct, total } = scores[concept];

    if (getLevel(getPercentage(correct, total)) === "weak") {
      addConcept(concept);
    }
  }

  // Add medium concepts next.
  for (const concept of concepts) {
    const { correct, total } = scores[concept];

    if (getLevel(getPercentage(correct, total)) === "medium") {
      addConcept(concept);
    }
  }

  return roadmap;
}

export {
  calculateScores,
  getPercentage,
  getLevel,
  getWeakConcepts,
  generateRoadmap
};

