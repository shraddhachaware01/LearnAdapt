
const questions = [
  // Promise basics
  {
    id: 1,
    question: "What does a Promise represent in JavaScript?",
    options: ["A future result", "A CSS style", "An HTML element", "A loop"],
    correctAnswer: "A future result",
    concept: "promise-basics",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "understanding-promises"
  },
  {
    id: 2,
    question: "Which method handles a fulfilled Promise?",
    options: [".then()", ".catch()", ".push()", ".map()"],
    correctAnswer: ".then()",
    concept: "promise-basics",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "promise-then-method"
  },
  {
    id: 3,
    question: "Which method handles a rejected Promise?",
    options: [".map()", ".catch()", ".join()", ".shift()"],
    correctAnswer: ".catch()",
    concept: "promise-basics",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "promise-catch-method"
  },

  // Promise states
  {
    id: 4,
    question: "Which are the three states of a Promise?",
    options: [
      "Pending, fulfilled, rejected",
      "Start, run, stop",
      "Open, closed, saved",
      "True, false, null"
    ],
    correctAnswer: "Pending, fulfilled, rejected",
    concept: "promise-states",
    difficulty: "medium",
    gapType: "conceptual",
    skill: "promise-states"
  },
  {
    id: 5,
    question: "What is the initial state of a new Promise?",
    options: ["Fulfilled", "Rejected", "Pending", "Completed"],
    correctAnswer: "Pending",
    concept: "promise-states",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "initial-promise-state"
  },
  {
    id: 6,
    question: "Can a settled Promise change its state again?",
    options: ["Always", "Only twice", "Never", "Only after a timeout"],
    correctAnswer: "Never",
    concept: "promise-states",
    difficulty: "medium",
    gapType: "logical",
    skill: "promise-state-transitions"
  },

  // then and catch
  {
    id: 7,
    question: "Which method handles a fulfilled Promise?",
    options: [".then()", ".catch()", ".finally()", ".reduce()"],
    correctAnswer: ".then()",
    concept: "then-catch",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "then-method"
  },
  {
    id: 8,
    question: "Which method is commonly used to handle Promise rejection?",
    options: [".map()", ".catch()", ".filter()", ".slice()"],
    correctAnswer: ".catch()",
    concept: "then-catch",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "catch-method"
  },
  {
    id: 9,
    question: "What does a .then() callback receive when its Promise fulfills?",
    options: [
      "The fulfillment value",
      "The CSS stylesheet",
      "The HTML document",
      "The function name"
    ],
    correctAnswer: "The fulfillment value",
    concept: "then-catch",
    difficulty: "medium",
    gapType: "logical",
    skill: "promise-fulfillment-value"
  },

  // Async / await
  {
    id: 10,
    question: "Which keyword declares an asynchronous function?",
    options: ["async", "await", "defer", "promise"],
    correctAnswer: "async",
    concept: "async-await",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "async-keyword"
  },
  {
    id: 11,
    question: "What does await do inside an async function?",
    options: [
      "Waits for a Promise's result before continuing that function",
      "Stops the entire browser permanently",
      "Creates a new HTML element",
      "Deletes the Promise"
    ],
    correctAnswer: "Waits for a Promise's result before continuing that function",
    concept: "async-await",
    difficulty: "medium",
    gapType: "logical",
    skill: "await-execution"
  },
  {
    id: 12,
    question: "What does an async function return?",
    options: ["A Promise", "A CSS rule", "An HTML tag", "A loop"],
    correctAnswer: "A Promise",
    concept: "async-await",
    difficulty: "medium",
    gapType: "application",
    skill: "async-function-return"
  },

  // Error handling
  {
    id: 13,
    question: "Which statement is commonly used to handle exceptions?",
    options: ["try...catch", "if...else only", "for...of", "switch only"],
    correctAnswer: "try...catch",
    concept: "error-handling",
    difficulty: "easy",
    gapType: "conceptual",
    skill: "try-catch-basics"
  },
  {
    id: 14,
    question: "Where does the catch block handle an exception thrown in a try block?",
    options: [
      "In the catch block",
      "In the options array",
      "In the question ID",
      "In a CSS selector"
    ],
    correctAnswer: "In the catch block",
    concept: "error-handling",
    difficulty: "medium",
    gapType: "logical",
    skill: "exception-flow"
  },
  {
    id: 15,
    question: "Which method can handle a rejected Promise in a Promise chain?",
    options: [".catch()", ".push()", ".join()", ".sort()"],
    correctAnswer: ".catch()",
    concept: "error-handling",
    difficulty: "medium",
    gapType: "application",
    skill: "promise-error-handling"
  }
];

export default questions;
