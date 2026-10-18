
import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <h1>LearnAdapt AI</h1>
      <p>Learn Smarter. Learn Your Way.</p>

      <p>
        Discover what you know, identify your weak concepts,
        and follow a personalized learning roadmap.
      </p>

      <nav>
        <Link to="/quiz">Start Learning</Link>
        {' | '}
        <Link to="/dashboard">View Dashboard</Link>
      </nav>
    </main>
  );
}

export default Home;
