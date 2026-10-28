
import { useNavigate, useSearchParams } from 'react-router-dom';

const lessons = {
  'promise-basics': {
    title: 'Promise Basics',
    level: 'Beginner',
    description:
      'A Promise is a JavaScript object that represents the eventual success or failure of an asynchronous operation.',
    topics: [
      'Why asynchronous operations are useful',
      'What a Promise represents',
      'How to create a Promise using new Promise()',
      'The difference between resolve() and reject()',
    ],
    example: `const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation completed!");
  } else {
    reject("Operation failed!");
  }
});

myPromise.then((message) => {
  console.log(message);
}).catch((error) => {
  console.log(error);
});`,
    practice: 'What does resolve() do in a Promise?',
    options: [
      'Marks the Promise as fulfilled with a value',
      'Always stops the JavaScript program',
      'Automatically retries a failed operation',
      'Converts a Promise into a normal function',
    ],
    answer: 0,
  },
  'promise-states': {
    title: 'Promise States',
    level: 'Beginner',
    description:
      'A Promise has three possible states: pending, fulfilled, and rejected.',
    topics: [
      'Pending: the operation has not settled yet',
      'Fulfilled: the operation completed successfully',
      'Rejected: the operation failed',
      'A settled Promise does not change to another state',
    ],
    example: `const result = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Done!");
  }, 1000);
});

result.then((value) => console.log(value));`,
    practice: 'Which state means a Promise completed successfully?',
    options: ['Pending', 'Fulfilled', 'Rejected', 'Waiting'],
    answer: 1,
  },
  'then-catch': {
    title: 'Then & Catch',
    level: 'Beginner',
    description:
      'The then() method handles fulfillment, while catch() handles rejection in a Promise chain.',
    topics: [
      'Use then() to process a fulfilled value',
      'Use catch() to handle a rejection',
      'Return values to pass data through a chain',
      'Handle errors without hiding them',
    ],
    example: `Promise.resolve(10)
  .then((value) => {
    return value * 2;
  })
  .then((result) => {
    console.log(result); // 20
  })
  .catch((error) => {
    console.error(error);
  });`,
    practice: 'Which method is commonly used to handle Promise rejections?',
    options: ['start()', 'thenOnly()', 'catch()', 'repeat()'],
    answer: 2,
  },
  'async-await': {
    title: 'Async / Await',
    level: 'Beginner',
    description:
      'async and await let you write Promise-based asynchronous code in a more readable style.',
    topics: [
      'An async function returns a Promise',
      'await pauses the async function until a Promise settles',
      'Use try/catch for error handling',
      'await does not block the entire JavaScript thread',
    ],
    example: `function getMessage() {
  return Promise.resolve("Hello, learner!");
}

async function showMessage() {
  const message = await getMessage();
  console.log(message);
}

showMessage();`,
    practice: 'What does an async function return?',
    options: [
      'Always a string',
      'A Promise',
      'Only undefined',
      'A DOM element',
    ],
    answer: 1,
  },
  'error-handling': {
    title: 'Error Handling',
    level: 'Beginner',
    description:
      'Error handling helps your application respond safely when asynchronous operations fail.',
    topics: [
      'Use try/catch with async/await',
      'Use catch() in a Promise chain',
      'Understand rejected Promises',
      'Provide useful error messages',
    ],
    example: `async function loadData() {
  try {
    const data = await Promise.reject(
      new Error("Request failed")
    );
    console.log(data);
  } catch (error) {
    console.log("Could not load data:", error.message);
  }
}

loadData();`,
    practice: 'What is the purpose of a try/catch block?',
    options: [
      'To repeat a function forever',
      'To create a new Promise automatically',
      'To prevent every possible error',
      'To handle exceptions that occur in the try block',
    ],
    answer: 3,
  },
};

function Learn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const concept = searchParams.get('concept') || 'promise-basics';
  const lesson = lessons[concept];

  if (!lesson) {
    return (
      <main style={styles.page}>
        <h1>Lesson not found</h1>
        <p>Please select a concept from your learning roadmap.</p>
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  function startPractice() {
    navigate(`/learn/practice?concept=${encodeURIComponent(concept)}`);
  }

  return (
    <main style={styles.page}>
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <section style={styles.header}>
        <p style={styles.eyebrow}>LEARNADAPT AI · PERSONALIZED LEARNING</p>
        <h1>{lesson.title}</h1>
        <span style={styles.level}>{lesson.level}</span>
        <p style={styles.description}>{lesson.description}</p>
      </section>

      <section style={styles.card}>
        <h2>What you will learn</h2>
        <ul style={styles.list}>
          {lesson.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      <section style={styles.card}>
        <h2>Understand with code</h2>
        <p>Read the example and notice how the Promise is handled.</p>
        <pre style={styles.code}>
          <code>{lesson.example}</code>
        </pre>
        <button
          style={styles.secondaryButton}
          onClick={() => navigator.clipboard?.writeText(lesson.example)}
        >
          Copy code
        </button>
      </section>

      <section style={styles.card}>
        <h2>Check your understanding</h2>
        <p>{lesson.practice}</p>
        <button style={styles.primaryButton} onClick={startPractice}>
          Start practice →
        </button>
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 20px 60px',
    fontFamily: 'Arial, sans-serif',
    color: '#24213b',
  },
  backButton: {
    border: 'none',
    background: 'transparent',
    color: '#5b4bd8',
    cursor: 'pointer',
    fontSize: '15px',
    marginBottom: '24px',
  },
  header: {
    padding: '30px',
    borderRadius: '20px',
    background: '#f2efff',
    marginBottom: '22px',
  },
  eyebrow: {
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#6554c0',
  },
  level: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    background: '#e3dcff',
    color: '#5141a5',
    fontSize: '13px',
  },
  description: {
    lineHeight: 1.7,
    marginBottom: 0,
  },
  card: {
    padding: '24px',
    border: '1px solid #e9e6f2',
    borderRadius: '16px',
    marginBottom: '20px',
    background: '#fff',
  },
  list: {
    lineHeight: 2,
    paddingLeft: '22px',
  },
  code: {
    padding: '18px',
    borderRadius: '12px',
    background: '#201d32',
    color: '#f3f0ff',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    fontSize: '13px',
  },
  primaryButton: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '10px',
    background: '#6554d9',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: '9px 14px',
    border: '1px solid #d9d3ee',
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
  },
};

export default Learn;
