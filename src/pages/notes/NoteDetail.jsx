import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import './NoteDetail.css';

const notes = {
  'javascript-introduction': {
    title: 'Introduction to JavaScript',
    category: 'JavaScript Basics',
    description: 'Understand JavaScript and how it makes websites interactive.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
    introduction: 'JavaScript is a programming language used to make websites interactive and dynamic. HTML creates structure, CSS controls appearance, and JavaScript adds behaviour.',
    syntax: `console.log("Hello, JavaScript!");

let name = "Shraddha";
console.log(name);`,
    explanation: [
      {
        heading: '1. What is JavaScript?',
        content: 'JavaScript is a high-level programming language commonly used in frontend and backend web development.',
        code: `console.log("Welcome to LearnAdapt AI");`,
        output: 'Welcome to LearnAdapt AI'
      },
      {
        heading: '2. Features of JavaScript',
        content: 'JavaScript is dynamically typed and supports object-oriented and functional programming.',
        code: `let language = "JavaScript";
console.log(typeof language);`,
        output: 'string'
      },
      {
        heading: '3. Where is JavaScript Used?',
        content: 'JavaScript is used for interactive websites, web applications and server-side development.',
        code: `let technology = "JavaScript";
console.log(technology);`,
        output: 'JavaScript'
      }
    ],
    important: [
      'JavaScript is different from Java.',
      'JavaScript is case-sensitive.',
      'It can manipulate HTML using the DOM.',
      'Node.js allows JavaScript to run on servers.',
      'JavaScript is widely used in full-stack development.'
    ],
    mistakes: [
      'Confusing JavaScript with Java.',
      'Forgetting that JavaScript is case-sensitive.',
      'Missing quotation marks around strings.',
      'Assuming JavaScript is used only for frontend development.'
    ],
    application: 'JavaScript is used to build interactive websites, dashboards, forms, APIs and full-stack applications.'
  },

  variables: {
    title: 'JavaScript Variables',
    category: 'JavaScript Basics',
    description: 'Learn how to declare, store and manage data in JavaScript.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations',
    introduction: 'Variables are named containers used to store information such as names, numbers, marks and other values.',
    syntax: `let variableName = value;
const variableName = value;
var variableName = value;`,
    explanation: [
      {
        heading: '1. let',
        content: 'The let keyword declares a variable whose value can be reassigned later. It has block scope.',
        code: `let age = 21;
age = 22;
console.log(age);`,
        output: '22'
      },
      {
        heading: '2. const',
        content: 'The const keyword declares a variable that cannot be reassigned. It must be initialized when declared.',
        code: `const student = "Shraddha";
console.log(student);`,
        output: 'Shraddha'
      },
      {
        heading: '3. var',
        content: 'The var keyword is the older way to declare variables. It has function scope and can be redeclared.',
        code: `var city = "Pune";
var city = "Mumbai";
console.log(city);`,
        output: 'Mumbai'
      }
    ],
    important: [
      'Variable names are case-sensitive.',
      'Variable names cannot start with a number.',
      'Use meaningful names.',
      'Use const when reassignment is not required.',
      'Use let when a value needs to change.'
    ],
    mistakes: [
      'Trying to reassign a const variable.',
      'Using unclear variable names.',
      'Using a variable before it has been declared.',
      'Forgetting that let and const have block scope.'
    ],
    application: 'Variables store user information, shopping cart totals, login details, form values and API responses.'
  },

  'data-types': {
    title: 'JavaScript Data Types',
    category: 'JavaScript Basics',
    description: 'Understand the different types of values JavaScript can store.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_types',
    introduction: 'Data types describe the kind of value stored in a JavaScript variable. JavaScript has primitive types and objects.',
    syntax: `let name = "Shraddha";
let age = 22;
let isStudent = true;`,
    explanation: [
      {
        heading: '1. String',
        content: 'Strings represent text and are written inside single quotes, double quotes or backticks.',
        code: `let name = "Shraddha";
console.log(name);`,
        output: 'Shraddha'
      },
      {
        heading: '2. Number',
        content: 'The number type represents integers and decimal numbers.',
        code: `let marks = 85;
let percentage = 85.5;
console.log(marks);
console.log(percentage);`,
        output: '85\n85.5'
      },
      {
        heading: '3. Boolean',
        content: 'Boolean values represent true or false.',
        code: `let isLoggedIn = true;
console.log(isLoggedIn);`,
        output: 'true'
      },
      {
        heading: '4. Undefined and Null',
        content: 'Undefined usually means a variable has no assigned value. Null represents an intentional absence of value.',
        code: `let result;
let selectedValue = null;
console.log(result);
console.log(selectedValue);`,
        output: 'undefined\nnull'
      }
    ],
    important: [
      'JavaScript is dynamically typed.',
      'Use typeof to inspect many value types.',
      'typeof null returns "object" due to historical behaviour.',
      'Arrays and functions are objects.'
    ],
    mistakes: [
      'Confusing null with undefined.',
      'Assuming arrays have a separate typeof result.',
      'Assuming variables have fixed types.'
    ],
    application: 'Data types help applications handle names, prices, choices, login status and API data.'
  },

  operators: {
    title: 'JavaScript Operators',
    category: 'JavaScript Basics',
    description: 'Learn how operators perform calculations and comparisons.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators',
    introduction: 'Operators are symbols or keywords used to perform operations on values and variables.',
    syntax: `let result = value1 + value2;`,
    explanation: [
      {
        heading: '1. Arithmetic Operators',
        content: 'Arithmetic operators perform addition, subtraction, multiplication and division.',
        code: `let a = 10;
let b = 5;
console.log(a + b);
console.log(a * b);
console.log(a % b);`,
        output: '15\n50\n0'
      },
      {
        heading: '2. Comparison Operators',
        content: 'Comparison operators compare values and return a Boolean result.',
        code: `console.log(10 > 5);
console.log(10 === 5);`,
        output: 'true\nfalse'
      },
      {
        heading: '3. Logical Operators',
        content: 'AND, OR and NOT operators combine or reverse conditions.',
        code: `console.log(true && false);
console.log(true || false);
console.log(!true);`,
        output: 'false\ntrue\nfalse'
      }
    ],
    important: [
      'Use === for strict equality.',
      'The % operator returns a remainder.',
      '&& means AND, || means OR and ! means NOT.'
    ],
    mistakes: [
      'Confusing assignment = with equality ===.',
      'Using == without understanding type conversion.',
      'Forgetting operator precedence.'
    ],
    application: 'Operators calculate prices, validate conditions, compare marks and control application behaviour.'
  },

  'conditional-statements': {
    title: 'JavaScript Conditional Statements',
    category: 'Control Flow',
    description: 'Learn how to execute code based on conditions.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
    introduction: 'Conditional statements allow a program to make decisions and execute different code depending on whether a condition is true or false.',
    syntax: `if (condition) {
  // code
} else {
  // alternative code
}`,
    explanation: [
      {
        heading: '1. if Statement',
        content: 'The if statement executes a block when its condition is true.',
        code: `let age = 20;
if (age >= 18) {
  console.log("Eligible to vote");
}`,
        output: 'Eligible to vote'
      },
      {
        heading: '2. if...else Statement',
        content: 'The else block executes when the if condition is false.',
        code: `let marks = 35;
if (marks >= 40) {
  console.log("Pass");
} else {
  console.log("Fail");
}`,
        output: 'Fail'
      },
      {
        heading: '3. else if Statement',
        content: 'Use else if to check multiple conditions.',
        code: `let marks = 75;
if (marks >= 90) {
  console.log("Grade A");
} else if (marks >= 60) {
  console.log("Grade B");
} else {
  console.log("Grade C");
}`,
        output: 'Grade B'
      },
      {
        heading: '4. switch Statement',
        content: 'A switch statement selects a matching case based on an expression.',
        code: `let day = 2;
switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  default:
    console.log("Other day");
}`,
        output: 'Tuesday'
      }
    ],
    important: [
      'if checks whether a condition is true.',
      'else provides an alternative.',
      'else if checks additional conditions.',
      'switch is useful for multiple cases.',
      'Use break to prevent unwanted fall-through.'
    ],
    mistakes: [
      'Using = instead of === in comparisons.',
      'Writing conditions in the wrong order.',
      'Forgetting break in switch cases.',
      'Using incorrect comparison operators.'
    ],
    application: 'Conditional statements are used for login validation, eligibility checks, grades, payment status and user permissions.'
  },

  loops: {
    title: 'JavaScript Loops',
    category: 'Control Flow',
    description: 'Learn how to repeat code efficiently using loops.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration',
    introduction: 'Loops execute a block of code repeatedly while a condition is satisfied or while elements remain in a collection.',
    syntax: `for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
    explanation: [
      {
        heading: '1. for Loop',
        content: 'A for loop is commonly used when the number of iterations is known.',
        code: `for (let i = 1; i <= 3; i++) {
  console.log(i);
}`,
        output: '1\n2\n3'
      },
      {
        heading: '2. while Loop',
        content: 'A while loop repeats as long as its condition remains true.',
        code: `let i = 1;
while (i <= 3) {
  console.log(i);
  i++;
}`,
        output: '1\n2\n3'
      },
      {
        heading: '3. do...while Loop',
        content: 'A do...while loop executes its body at least once before checking the condition.',
        code: `let i = 1;
do {
  console.log(i);
  i++;
} while (i <= 3);`,
        output: '1\n2\n3'
      },
      {
        heading: '4. for...of Loop',
        content: 'A for...of loop iterates over values in iterable objects such as arrays.',
        code: `const fruits = ["Apple", "Mango"];
for (const fruit of fruits) {
  console.log(fruit);
}`,
        output: 'Apple\nMango'
      }
    ],
    important: [
      'for loops are useful for counted repetition.',
      'while loops depend on a condition.',
      'do...while executes at least once.',
      'for...of iterates over values.',
      'Use break to stop and continue to skip an iteration.'
    ],
    mistakes: [
      'Forgetting to update the loop counter.',
      'Creating an infinite loop.',
      'Using an incorrect stopping condition.',
      'Confusing for...of with for...in.'
    ],
    application: 'Loops display product lists, process quiz questions, calculate totals and iterate through API responses.'
  },

  functions: {
    title: 'JavaScript Functions',
    category: 'Functions',
    description: 'Learn how to create reusable blocks of JavaScript code.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
    introduction: 'A function is a reusable block of code designed to perform a particular task. Functions help organise code and avoid repetition.',
    syntax: `function functionName(parameters) {
  // statements
  return result;
}`,
    explanation: [
      {
        heading: '1. Function Declaration',
        content: 'A function declaration defines a named function that can be called in your program.',
        code: `function greet() {
  return "Hello!";
}
console.log(greet());`,
        output: 'Hello!'
      },
      {
        heading: '2. Parameters and Arguments',
        content: 'Parameters receive input values. Arguments are the actual values passed when calling a function.',
        code: `function add(a, b) {
  return a + b;
}
console.log(add(10, 20));`,
        output: '30'
      },
      {
        heading: '3. Arrow Functions',
        content: 'Arrow functions provide a shorter syntax for writing function expressions.',
        code: `const multiply = (a, b) => a * b;
console.log(multiply(4, 5));`,
        output: '20'
      }
    ],
    important: [
      'Functions can accept parameters.',
      'The return statement sends a value back.',
      'Code inside a function runs when called.',
      'Arrow functions have different this behaviour.'
    ],
    mistakes: [
      'Forgetting to call a function.',
      'Confusing parameters with arguments.',
      'Expecting a function without return to return a calculated value.'
    ],
    application: 'Functions are used for form validation, calculations, API calls, event handling and reusable UI logic.'
  },

  arrays: {
    title: 'JavaScript Arrays',
    category: 'Data Structures',
    description: 'Store and work with ordered collections of values.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    introduction: 'An array is an ordered collection of values. It allows us to store multiple values in one variable.',
    syntax: `const fruits = ["Apple", "Banana", "Mango"];`,
    explanation: [
      {
        heading: '1. Accessing Array Elements',
        content: 'Array indexes start from zero. Use an index to access a particular element.',
        code: `const fruits = ["Apple", "Banana", "Mango"];
console.log(fruits[0]);`,
        output: 'Apple'
      },
      {
        heading: '2. Adding and Removing Elements',
        content: 'push adds an element at the end, while pop removes the last element.',
        code: `const numbers = [10, 20];
numbers.push(30);
numbers.pop();
console.log(numbers);`,
        output: '[10, 20]'
      },
      {
        heading: '3. Array map()',
        content: 'map creates a new array by applying a function to each element.',
        code: `const numbers = [1, 2, 3];
const doubled = numbers.map(number => number * 2);
console.log(doubled);`,
        output: '[2, 4, 6]'
      }
    ],
    important: [
      'Array indexing starts at zero.',
      'Arrays can contain different value types.',
      'map returns a new array.',
      'filter selects elements based on a condition.'
    ],
    mistakes: [
      'Trying to access an invalid index.',
      'Confusing push and unshift.',
      'Expecting map to modify the original array.'
    ],
    application: 'Arrays store product lists, student records, API results, quiz questions and shopping cart items.'
  },

  objects: {
    title: 'JavaScript Objects',
    category: 'Data Structures',
    description: 'Understand how to organise related data using key-value pairs.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects',
    introduction: 'Objects are collections of properties. Each property has a key and a value. Objects help represent real-world entities in code.',
    syntax: `const student = {
  name: "Shraddha",
  age: 22
};`,
    explanation: [
      {
        heading: '1. Creating an Object',
        content: 'Objects can be created using curly braces and key-value pairs.',
        code: `const student = {
  name: "Shraddha",
  age: 22
};
console.log(student.name);`,
        output: 'Shraddha'
      },
      {
        heading: '2. Accessing Properties',
        content: 'Use dot notation or bracket notation to access object properties.',
        code: `const user = { name: "Alex" };
console.log(user.name);
console.log(user["name"]);`,
        output: 'Alex\nAlex'
      },
      {
        heading: '3. Object Methods',
        content: 'An object method is a function stored as a property of an object.',
        code: `const user = {
  name: "Alex",
  greet() {
    return "Hello " + this.name;
  }
};
console.log(user.greet());`,
        output: 'Hello Alex'
      }
    ],
    important: [
      'Objects store data as key-value pairs.',
      'Properties can be added, updated or deleted.',
      'Objects can contain other objects and arrays.',
      'Use dot notation for simple property names.'
    ],
    mistakes: [
      'Confusing object keys with variable names.',
      'Trying to access a property that does not exist.',
      'Forgetting that objects are reference values.'
    ],
    application: 'Objects represent users, products, orders, API responses and application settings.'
  },

  promises: {
    title: 'JavaScript Promises',
    category: 'Advanced JavaScript',
    description: 'Understand how JavaScript handles asynchronous operations.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
    introduction: 'A Promise represents the eventual completion or failure of an asynchronous operation. It helps manage tasks such as fetching information from a server.',
    syntax: `const promise = new Promise((resolve, reject) => {
  // asynchronous operation
});`,
    explanation: [
      {
        heading: '1. Promise States',
        content: 'A promise can be pending, fulfilled or rejected.',
        code: `const promise = Promise.resolve("Success");
promise.then(result => {
  console.log(result);
});`,
        output: 'Success'
      },
      {
        heading: '2. then() and catch()',
        content: 'then handles fulfilled promises. catch handles rejected promises.',
        code: `Promise.resolve("Data loaded")
  .then(result => console.log(result))
  .catch(error => console.log(error));`,
        output: 'Data loaded'
      },
      {
        heading: '3. finally()',
        content: 'finally runs after a promise settles, whether fulfilled or rejected.',
        code: `Promise.resolve("Done")
  .finally(() => console.log("Finished"));`,
        output: 'Finished'
      }
    ],
    important: [
      'A promise represents a future result.',
      'A promise settles only once.',
      'Use catch to handle rejection.',
      'Promise.all can coordinate multiple promises.'
    ],
    mistakes: [
      'Forgetting to return a promise in a chain.',
      'Ignoring rejected promises.',
      'Confusing a promise with its eventual result.'
    ],
    application: 'Promises are commonly used for API requests, database operations, file loading and asynchronous tasks.'
  },

  'async-await': {
    title: 'JavaScript Async / Await',
    category: 'Advanced JavaScript',
    description: 'Write asynchronous code in a readable way.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
    introduction: 'Async and await are JavaScript keywords that make working with promises easier to read and organise.',
    syntax: `async function functionName() {
  const result = await somePromise;
}`,
    explanation: [
      {
        heading: '1. async Functions',
        content: 'An async function always returns a promise.',
        code: `async function greet() {
  return "Hello!";
}
greet().then(console.log);`,
        output: 'Hello!'
      },
      {
        heading: '2. await',
        content: 'The await keyword waits for a promise to settle inside an async function.',
        code: `async function getData() {
  const result = await Promise.resolve("Data received");
  console.log(result);
}
getData();`,
        output: 'Data received'
      },
      {
        heading: '3. Error Handling',
        content: 'Use try and catch inside async functions to handle rejected promises.',
        code: `async function loadData() {
  try {
    const result = await Promise.resolve("Loaded");
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
loadData();`,
        output: 'Loaded'
      }
    ],
    important: [
      'An async function returns a promise.',
      'await is used inside async functions or supported module contexts.',
      'Use try and catch for error handling.',
      'await does not block the entire JavaScript application.'
    ],
    mistakes: [
      'Using await in an unsupported context.',
      'Forgetting to handle errors.',
      'Expecting an async function to return a plain value instead of a promise.'
    ],
    application: 'Async and await are commonly used for fetching API data, authentication, saving forms and loading dashboard information.'
  },

  'error-handling': {
    title: 'JavaScript Error Handling',
    category: 'Advanced JavaScript',
    description: 'Learn how to detect and handle errors in JavaScript.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
    introduction: 'Error handling allows developers to detect unexpected problems and respond to them without causing an uncontrolled failure in the application.',
    syntax: `try {
  // code that may cause an error
} catch (error) {
  // handle the error
} finally {
  // cleanup code
}`,
    explanation: [
      {
        heading: '1. try...catch',
        content: 'The try block contains code that may throw an error. The catch block handles the error.',
        code: `try {
  throw new Error("Something went wrong");
} catch (error) {
  console.log(error.message);
}`,
        output: 'Something went wrong'
      },
      {
        heading: '2. throw Statement',
        content: 'The throw statement allows developers to create custom errors.',
        code: `let age = 15;
try {
  if (age < 18) {
    throw new Error("Age must be 18 or above");
  }
} catch (error) {
  console.log(error.message);
}`,
        output: 'Age must be 18 or above'
      },
      {
        heading: '3. finally Block',
        content: 'The finally block executes after try and catch, whether an error occurs or not.',
        code: `try {
  console.log("Try block");
} catch (error) {
  console.log("Error occurred");
} finally {
  console.log("Finished");
}`,
        output: 'Try block\nFinished'
      },
      {
        heading: '4. Handling Promise Errors',
        content: 'Promise rejections can be handled using catch or try...catch with await.',
        code: `async function loadData() {
  try {
    throw new Error("Request failed");
  } catch (error) {
    console.log(error.message);
  }
}
loadData();`,
        output: 'Request failed'
      }
    ],
    important: [
      'Use try...catch to handle exceptions.',
      'The catch block receives the thrown error.',
      'throw creates an exception.',
      'finally executes whether an exception occurs or not.',
      'Handle rejected promises to avoid unhandled rejections.'
    ],
    mistakes: [
      'Using try without catch or finally.',
      'Ignoring important error messages.',
      'Using empty catch blocks without a reason.',
      'Forgetting to handle asynchronous errors.'
    ],
    application: 'Error handling is important for form validation, API requests, authentication, database operations and reliable web applications.'
  }
};

const topicOrder = [
  'javascript-introduction',
  'variables',
  'data-types',
  'operators',
  'conditional-statements',
  'loops',
  'functions',
  'arrays',
  'objects',
  'promises',
  'async-await',
  'error-handling'
];

function NoteDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const note = notes[topicId];
  const currentIndex = topicOrder.indexOf(topicId);
  const [completedTopics, setCompletedTopics] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('learnadapt-completed-topics')
    ) || [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem(
    'learnadapt-completed-topics',
    JSON.stringify(completedTopics)
  );
}, [completedTopics]);
const isCompleted = completedTopics.includes(topicId);
const toggleCompletion = () => {
  setCompletedTopics((previous) =>
    isCompleted
      ? previous.filter((id) => id !== topicId)
      : [...previous, topicId]
  );
};

  if (!note) {
    return (
      <DashboardLayout>
        <main className="note-detail-page">
          <h1>Topic not found</h1>
          <button onClick={() => navigate('/notes')}>
            Back to My Notes
          </button>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="note-detail-page">
        <button
          className="note-back-button"
          onClick={() => navigate('/notes')}
        >
          ← Back to JavaScript Notes
        </button>

        <div className="note-breadcrumb">
          My Notes / JavaScript / {note.title}
        </div>

        <header className="note-detail-header">
          <span className="note-topic-tag">
            {note.category.toUpperCase()}
          </span>

          <h1>{note.title}</h1>
          <p>{note.description}</p>

          <a href={note.mdn} target="_blank" rel="noopener noreferrer">
            Official MDN Documentation ↗
          </a>
        </header>
        <div className="note-completion">
  <button
    className="note-complete-button"
    onClick={toggleCompletion}
  >
    {isCompleted ? '✓ Completed' : 'Mark as Completed'}
  </button>
</div> 

<nav className="note-toc">
  <h3>On This Page</h3>

  <div className="note-toc-links">
    <a href="#introduction">1. Introduction</a>
    <a href="#syntax">2. Syntax</a>
    <a href="#explanation">3. Detailed Explanation</a>
    <a href="#important-points">4. Important Points</a>
    <a href="#common-mistakes">5. Common Mistakes</a>
    <a href="#applications">6. Real-world Applications</a>
    <a href="#further-learning">7. Further Learning</a>
  </div>
</nav>


        <article className="note-article">
          <section>
            <h2>1. Introduction</h2>
            <p>{note.introduction}</p>
          </section>

         <section id="syntax">
            <h2>2. Syntax</h2>
            <pre className="note-code">{note.syntax}</pre>
          </section>

          	<section id="explanation">
            <h2>3. Detailed Explanation and Examples</h2>

            {note.explanation.map((item) => (
              <div className="note-info-card" key={item.heading}>
                <h3>{item.heading}</h3>
                <p>{item.content}</p>
                <pre className="note-code">{item.code}</pre>
                <h4>Expected Output</h4>
                <pre className="note-output">{item.output}</pre>
              </div>
            ))}
          </section>

          	<section id="important-points">
            <h2>4. Important Points</h2>
            <ul>
              {note.important.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section id="common-mistakes">
            <h2>5. Common Mistakes</h2>
            <ul>
              {note.mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </section>

          <section id="applications">
            <h2>6. Real-world Applications</h2>
            <p>{note.application}</p>
          </section>

          <section id="further-learning">
            <h2>7. Further Learning</h2>
            <p>
              Continue learning with the official MDN reference.
            </p>
            <a
              className="note-mdn-button"
              href={note.mdn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Complete MDN Documentation ↗
            </a>
          </section>
        </article>

        <div className="note-navigation">
          <button
            disabled={currentIndex <= 0}
            onClick={() =>
              navigate(`/notes/${topicOrder[currentIndex - 1]}`)
            }
          >
            ← Previous Topic
          </button>

          <button
            disabled={currentIndex === topicOrder.length - 1}
            onClick={() =>
              navigate(`/notes/${topicOrder[currentIndex + 1]}`)
            }
          >
            Next Topic →
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default NoteDetail;
