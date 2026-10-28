
function checkAnswer(question, userAnswer) {
  return question.correctAnswer === userAnswer;
}

function getPercentage(correct, total) {
  if (total === 0) return 0;
  return Number(((correct / total) * 100).toFixed(2));
}

function getLevel(percent) {
  if (percent < 50) return 'weak';
  if (percent < 80) return 'medium';
  return 'strong';
}

const prerequisites = {
  'promise-basics': [],
  'promise-states': ['promise-basics'],
  'then-catch': ['promise-states'],
  'async-await': ['then-catch'],
  'error-handling': ['then-catch'],
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

    if (getLevel(percentage) === 'weak') {
      weakConcepts.push(concept);
    }
  }

  return weakConcepts;
}

function generateRoadmap(scores) {
  const roadmap = [];
  const addedConcepts = new Set();
  const visiting = new Set();

  // Preserve the assessment's concept order.
  const concepts = Object.keys(scores);

  function addConcept(concept) {
    if (addedConcepts.has(concept)) return;

    // Prevent infinite recursion if prerequisites ever form a cycle.
    if (visiting.has(concept)) return;

    visiting.add(concept);

    // Prerequisites must be considered before their dependent concept.
    for (const required of prerequisites[concept] || []) {
      const prerequisiteScore = scores[required];

      if (!prerequisiteScore) {
        // The prerequisite has not been assessed yet.
        addConcept(required);
      } else {
        const prerequisiteLevel = getLevel(
          getPercentage(
            prerequisiteScore.correct,
            prerequisiteScore.total
          )
        );

        // Include a prerequisite if it still needs practice.
        if (prerequisiteLevel !== 'strong') {
          addConcept(required);
        }
      }
    }

    visiting.delete(concept);

    const score = scores[concept];

    // A prerequisite without a score can still be recommended.
    if (!score) {
      addedConcepts.add(concept);
      roadmap.push(concept);
      return;
    }

    const level = getLevel(
      getPercentage(score.correct, score.total)
    );

    // Strong concepts don't need practice unless required above.
    if (level === 'strong') return;

    addedConcepts.add(concept);
    roadmap.push(concept);
  }

  // Weak concepts get priority.
  for (const concept of concepts) {
    const { correct, total } = scores[concept];

    if (getLevel(getPercentage(correct, total)) === 'weak') {
      addConcept(concept);
    }
  }

  // Medium concepts follow weak concepts.
  for (const concept of concepts) {
    const { correct, total } = scores[concept];

    if (getLevel(getPercentage(correct, total)) === 'medium') {
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
  generateRoadmap,
};
