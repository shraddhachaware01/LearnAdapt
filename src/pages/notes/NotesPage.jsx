
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import './NotesPage.css';

const topics = [
  {
    title: 'JavaScript Introduction',
    category: 'Basics',
    description: 'Understand JavaScript, its features and how it works.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
  },
  {
    title: 'Variables',
    category: 'Basics',
    description: 'Learn var, let, const and variable scope.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
  },
  {
    title: 'Data Types',
    category: 'Basics',
    description: 'Explore primitive and non-primitive data types.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_types',
  },
  {
    title: 'Operators',
    category: 'Basics',
    description: 'Understand arithmetic, comparison and logical operators.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators',
  },
  {
    title: 'Conditional Statements',
    category: 'Control Flow',
    description: 'Learn if, else, switch and conditional logic.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
  },
  {
    title: 'Loops',
    category: 'Control Flow',
    description: 'Understand for, while and other iteration methods.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration',
  },
  {
    title: 'Functions',
    category: 'Functions',
    description: 'Learn function declarations, expressions and parameters.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
  },
  {
    title: 'Arrays',
    category: 'Data Structures',
    description: 'Explore arrays and common array operations.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
  },
  {
    title: 'Objects',
    category: 'Data Structures',
    description: 'Learn object properties, methods and structures.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects',
  },
  {
    title: 'Promises',
    category: 'Advanced JavaScript',
    description: 'Understand asynchronous operations and promise states.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
  },
  {
    title: 'Async / Await',
    category: 'Advanced JavaScript',
    description: 'Write asynchronous JavaScript using async and await.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
  },
  {
    title: 'Error Handling',
    category: 'Advanced JavaScript',
    description: 'Learn try, catch, throw and error handling.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling',
  },
];

const categories = [
  'All Topics',
  'Basics',
  'Control Flow',
  'Functions',
  'Data Structures',
  'Advanced JavaScript',
];

function NotesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Topics');
  const [completedTopics, setCompletedTopics] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('learnadapt-completed-topics')
    ) || [];
  } catch {
    return [];
  }
});

const totalTopics = topics.length;
const completedCount = completedTopics.length;

const progressPercentage = Math.round(
  (completedCount / totalTopics) * 100
);

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === 'All Topics' ||
      topic.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <main className="notes-page">
        <header className="notes-header">
          <div>
            <p className="notes-eyebrow">YOUR LEARNING LIBRARY</p>
            <h1>My Notes</h1>
            <p>
              Explore JavaScript concepts and developer documentation.
            </p>
          </div>

          <div className="notes-header-icon">📚</div>
        </header>

        <section className="notes-intro">
          <div className="notes-js-icon">JS</div>

          <div>
            <h2>JavaScript Documentation</h2>
            <p>
              Learn JavaScript from fundamentals to advanced concepts
              with trusted MDN Web Docs resources.
            </p>
            <span>Source: MDN Web Docs</span>
          </div>
        </section>
            

      {/* Learning Progress */}
      <section className="notes-progress">
        <div className="notes-progress-header">
          <div>
            <h2>JavaScript Learning Progress</h2>
            <p>Track your completed learning topics.</p>
          </div>

          <span>
            {completedCount} / {totalTopics} Completed
          </span>
        </div>

        <div className="notes-progress-bar">
          <div
            className="notes-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="notes-progress-text">
          {progressPercentage}% completed — Keep learning and growing!
        </p>
      </section>

      

        <section className="notes-content">
          <div className="notes-section-heading">
            <div>
              <h2>Explore Topics</h2>
              <p>Choose a topic to access its documentation.</p>
            </div>

            <span>{filteredTopics.length} topics</span>
          </div>

          <input
            className="notes-search"
            type="search"
            placeholder="Search JavaScript topics..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="notes-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? 'selected' : ''
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="notes-grid">
            {filteredTopics.map((topic, index) => (
              <article className="notes-topic-card" key={topic.title}>
                <div className="notes-topic-top">
                  <span className="notes-topic-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="notes-topic-category">
                    {topic.category}
                  </span>
                  {completedTopics.includes(
  topic.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
) && (
  <span className="notes-topic-completed">
    ✓ Completed
  </span>
)}
                </div>

                <h3>{topic.title}</h3>
                <p>{topic.description}</p>

               
          <Link
  to={`/notes/${topic.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`}
>
  Read Notes <span>→</span>
</Link>
            
              </article>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="notes-empty">
              <h3>No topics found</h3>
              <p>Try another search or category.</p>
            </div>
          )}
        </section>

        <footer className="notes-footer">
          Documentation provided by MDN Web Docs.
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit MDN →
          </a>
        </footer>
      </main>
    </DashboardLayout>
  );
}

export default NotesPage;
