import { Bell, BookOpen, Search, UserRound } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand-link">
            <span className="brand-icon">
              <BookOpen size={19} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span>Learn <span className="brand-accent">Hub</span></span>
          </a>

          <nav aria-label="Main navigation" className="main-nav">
            <a href="#resources"> 
              Resources
            </a>
            <a href="#courses">
              Courses
            </a>
            <a href="#about">
              About
            </a>
          </nav>

          <form className="search-form" role="search">
            <label htmlFor="site-search" className="visually-hidden">Search learning resources</label>
            <div className="search-box">
              <label htmlFor="category" className="visually-hidden">Category</label>
              <select
                id="category"
                defaultValue="all"
              >
                <option value="all">Category</option>
                <option value="courses">Courses</option>
                <option value="articles">Articles</option>
                <option value="videos">Videos</option>
              </select>
              <input
                id="site-search"
                type="search"
                placeholder="Search resources..."
              />
              <button
                type="submit"
                aria-label="Search"
              >
                <Search size={18} aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="header-actions">
            <button
              type="button"
              aria-label="View notifications"
              className="icon-button notification-button"
            >
              <Bell size={20} aria-hidden="true" />
              <span className="notification-dot" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="profile-button"
              aria-label="Open profile for Alex Morgan"
            >
              <span className="profile-icon">
                <UserRound size={18} aria-hidden="true" />
              </span>
              <span className="profile-name">Alex Morgan</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <p className="eyebrow">Your learning, organized</p>
        <h1>
          Learn something useful today.
        </h1>
        <p className="intro-text">
          Explore clear, practical learning resources gathered in one place.
        </p>
      </main>
    </div>
  );
}

export default App;
