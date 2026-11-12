
// Smart Learning Recommendations for LearnAdapt AI.
// These mappings reuse the existing Notes and Videos library entries.

const videoLibrary = {
  6: {
    id: 6,
    title: 'Async JavaScript',
    videoId: 'PoRJizFvM7s',
    category: 'Advanced JavaScript',
    duration: '35 min',
    route: '/videos',
  },
};

const noteLibrary = {
  promises: {
    title: 'Promises',
    slug: 'promises',
    route: '/notes/promises',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
  },
  asyncAwait: {
    title: 'Async / Await',
    slug: 'async-await',
    route: '/notes/async-await',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
  },
  errorHandling: {
    title: 'Error Handling',
    slug: 'error-handling',
    route: '/notes/error-handling',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
  },
};

// Maps the exact skill labels used in Practice.jsx.
const skillRecommendations = {
  'understanding-promises': {
    concept: 'promise-basics',
    title: 'Understand what a Promise represents',
    explanation: 'Review the purpose of Promises and how they represent the eventual result of asynchronous work.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'promise-then-method': {
    concept: 'promise-basics',
    title: 'Understand the then() method',
    explanation: 'Revise how then() handles a fulfilled Promise and passes values through a Promise chain.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'promise-resolve-value': {
    concept: 'promise-basics',
    title: 'Practice resolving Promise values',
    explanation: 'Work through examples that show how resolve(value) fulfills a Promise with a value.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'promise-states': {
    concept: 'promise-states',
    title: 'Revise the three Promise states',
    explanation: 'Review pending, fulfilled and rejected states, and how a Promise moves from pending to a settled state.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'fulfilled-promise-state': {
    concept: 'promise-states',
    title: 'Understand fulfilled Promises',
    explanation: 'Practice identifying successful completion and the fulfillment value of a Promise.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'promise-state-transitions': {
    concept: 'promise-states',
    title: 'Reason about Promise state transitions',
    explanation: 'Practice tracing a Promise after it has been fulfilled or rejected.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'promise-catch-method': {
    concept: 'then-catch',
    title: 'Understand the catch() method',
    explanation: 'Revise how catch() handles a rejection in a Promise chain.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'then-chain-value': {
    concept: 'then-catch',
    title: 'Trace values through then() chains',
    explanation: 'Practice predicting how a returned value is passed to the next Promise handler.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'promise-chain-output': {
    concept: 'then-catch',
    title: 'Predict Promise chain output',
    explanation: 'Trace each then() callback and predict the final output.',
    noteKeys: ['promises'],
    videoIds: [6],
  },
  'async-function-return': {
    concept: 'async-await',
    title: 'Understand async function return values',
    explanation: 'Review why an async function always returns a Promise.',
    noteKeys: ['asyncAwait'],
    videoIds: [6],
  },
  'await-usage': {
    concept: 'async-await',
    title: 'Practice using await',
    explanation: 'Review where await can be used and how it works inside an async function.',
    noteKeys: ['asyncAwait'],
    videoIds: [6],
  },
  'await-execution-flow': {
    concept: 'async-await',
    title: 'Trace async execution flow',
    explanation: 'Practice understanding how await suspends the async function without blocking the entire JavaScript thread.',
    noteKeys: ['asyncAwait'],
    videoIds: [6],
  },
  'async-error-handling': {
    concept: 'error-handling',
    title: 'Handle errors in async functions',
    explanation: 'Practice using try/catch with exceptions and rejected Promises in async functions.',
    noteKeys: ['errorHandling', 'promises'],
    videoIds: [6],
  },
  'promise-rejection-handling': {
    concept: 'error-handling',
    title: 'Handle Promise rejections',
    explanation: 'Revise rejection handling with catch() and follow the failure path in a Promise chain.',
    noteKeys: ['errorHandling', 'promises'],
    videoIds: [6],
  },
  'error-handling-practice': {
    concept: 'error-handling',
    title: 'Practice useful error handling',
    explanation: 'Practice responding to failures with useful error information and appropriate handling.',
    noteKeys: ['errorHandling'],
    videoIds: [6],
  },
};

const gapTypeGuidance = {
  conceptual: {
    label: 'Build conceptual understanding',
    description: 'Start with the notes, explain the idea in your own words, then check your understanding with practice questions.',
  },
  logical: {
    label: 'Strengthen logical reasoning',
    description: 'Trace code step by step, predict the result before running it, and explain why each step happens.',
  },
  application: {
    label: 'Improve practical application',
    description: 'Watch the related lesson, work through a small code example, and then solve practice questions.',
  },
};

export function getSmartRecommendations({
  weakSkills = [],
  weakGaps = [],
} = {}) {
  const normalizedSkills = weakSkills
    .map((item) =>
      typeof item === 'string'
        ? item
        : item?.skill || item?.name || ''
    )
    .filter(Boolean);

  const normalizedGapTypes = weakGaps
    .map((item) =>
      typeof item === 'string'
        ? item.toLowerCase()
        : (item?.gap_type || item?.gapType || item?.type || '').toLowerCase()
    )
    .filter(Boolean);

  const recommendations = normalizedSkills
    .map((skill) => {
      const mapping = skillRecommendations[skill];
      if (!mapping) return null;

      const notes = mapping.noteKeys
        .map((key) => noteLibrary[key])
        .filter(Boolean);

      const videos = mapping.videoIds
        .map((id) => videoLibrary[id])
        .filter(Boolean);

      return {
        skill,
        concept: mapping.concept,
        title: mapping.title,
        explanation: mapping.explanation,
        gapType: null,
        notes,
        videos,
        practiceRoute: `/learn/practice?concept=${encodeURIComponent(mapping.concept)}`,
      };
    })
    .filter(Boolean);

  const guidance = normalizedGapTypes
    .filter((type) => gapTypeGuidance[type])
    .map((type) => ({
      gapType: type,
      ...gapTypeGuidance[type],
    }));

  return {
    recommendations,
    guidance,
    hasRecommendations:
      recommendations.length > 0 || guidance.length > 0,
  };
}

export {
  gapTypeGuidance,
  noteLibrary,
  skillRecommendations,
  videoLibrary,
};
