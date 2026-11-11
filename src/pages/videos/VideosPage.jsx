
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import './VideosPage.css';

const videoTopics = [
  {
    id: 1,
    title: 'JavaScript Introduction',
    category: 'Basics',
    description: 'Understand JavaScript, its features and how it works.',
    duration: '15 min',
    level: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/mqdefault.jpg',
    videoId: 'W6NZfCO5SIk',
  },
  {
    id: 2,
    title: 'JavaScript Variables',
    category: 'Basics',
    description: 'Learn var, let, const and variable scope.',
    duration: '20 min',
    level: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/9WIJQDvt4Us/mqdefault.jpg',
    videoId: '9WIJQDvt4Us',
  },
  {
    id: 3,
    title: 'JavaScript Functions',
    category: 'Functions',
    description: 'Understand functions, parameters and return values.',
    duration: '25 min',
    level: 'Beginner',
    thumbnail: 'https://img.youtube.com/vi/xUI5Tsl2JpY/mqdefault.jpg',
    videoId: 'xUI5Tsl2JpY',
  },
  {
    id: 4,
    title: 'JavaScript Arrays',
    category: 'Data Structures',
    description: 'Learn how to create, access and manipulate arrays.',
    duration: '30 min',
    level: 'Intermediate',
    thumbnail: 'https://img.youtube.com/vi/oigfaZ5ApsM/mqdefault.jpg',
    videoId: 'oigfaZ5ApsM',
  },
  {
    id: 5,
    title: 'JavaScript Objects',
    category: 'Data Structures',
    description: 'Explore objects, properties and methods.',
    duration: '25 min',
    level: 'Intermediate',
    thumbnail: 'https://img.youtube.com/vi/PFmuCDHHpwk/mqdefault.jpg',
    videoId: 'PFmuCDHHpwk',
  },
  {
    id: 6,
    title: 'Async JavaScript',
    category: 'Advanced JavaScript',
    description: 'Understand callbacks, promises and asynchronous code.',
    duration: '35 min',
    level: 'Advanced',
    thumbnail: 'https://img.youtube.com/vi/PoRJizFvM7s/mqdefault.jpg',
    videoId: 'PoRJizFvM7s',
  },
];

const categories = [
  'All Videos',
  'Basics',
  'Functions',
  'Data Structures',
  'Advanced JavaScript',
];

function VideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Videos');

  const filteredVideos = videoTopics.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'All Videos' ||
      video.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="videos-page">
        <header className="videos-header">
          <div>
            <p className="videos-eyebrow">LEARN THROUGH VIDEO</p>
            <h1>Video Library</h1>
            <p className="videos-intro">
              Learn concepts step by step with curated video lessons.
              Watch, practice and improve your understanding.
            </p>
          </div>

          <div className="videos-header-icon">▶</div>
        </header>

        <section className="videos-summary">
          <div>
            <span className="videos-summary-icon">▶</span>
            <div>
              <h3>{videoTopics.length} Videos</h3>
              <p>Curated learning lessons</p>
            </div>
          </div>

          <div>
            <span className="videos-summary-icon">📚</span>
            <div>
              <h3>{categories.length - 1} Categories</h3>
              <p>Organized by topic</p>
            </div>
          </div>

          <div>
            <span className="videos-summary-icon">🎯</span>
            <div>
              <h3>Learn at Your Pace</h3>
              <p>Beginner to advanced</p>
            </div>
          </div>
        </section>

        <section className="videos-library">
          <div className="videos-section-heading">
            <div>
              <h2>Explore Lessons</h2>
              <p>Choose a topic and start learning.</p>
            </div>

            <div className="videos-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="videos-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? 'active' : ''
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="videos-grid">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <article className="video-card" key={video.id}>
                  <a
                    className="video-thumbnail"
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="video-play-button">▶</span>
                    <span className="video-duration">{video.duration}</span>
                  </a>

                  <div className="video-card-content">
                    <div className="video-card-meta">
                      <span>{video.category}</span>
                      <span>{video.level}</span>
                    </div>

                    <h3>{video.title}</h3>
                    <p>{video.description}</p>

                    <a
                      className="video-watch-link"
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch Lesson <span>→</span>
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="videos-empty">
                <h3>No videos found</h3>
                <p>Try another search or category.</p>
              </div>
            )}
          </div>
        </section>

        <section className="videos-notes-link">
          <div>
            <h3>Want to revise what you learned?</h3>
            <p>Explore structured JavaScript notes alongside your video lessons.</p>
          </div>
          <Link to="/notes">Explore My Notes →</Link>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default VideosPage;
