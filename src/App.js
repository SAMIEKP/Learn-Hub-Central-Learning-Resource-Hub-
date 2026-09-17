import {
  Bell,
  BookOpen,
  Bookmark,
  Clock3,
  LayoutDashboard,
  Library,
  Search,
  Settings,
  UserRound,
} from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/" className="brand-link">
          <span className="brand-icon">
            <BookOpen size={19} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span>Learn <span className="brand-accent">Hub</span></span>
        </a>

        <p className="sidebar-label">Workspace</p>
        <nav aria-label="Sidebar navigation" className="sidebar-nav">
          <a href="#dashboard" className="sidebar-link active">
            <LayoutDashboard size={18} aria-hidden="true" />
            Dashboard
          </a>
          <a href="#library" className="sidebar-link">
            <Library size={18} aria-hidden="true" />
            My library
          </a>
          <a href="#saved" className="sidebar-link">
            <Bookmark size={18} aria-hidden="true" />
            Saved resources
          </a>
          <a href="#recent" className="sidebar-link">
            <Clock3 size={18} aria-hidden="true" />
            Recent activity
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#settings" className="sidebar-link">
            <Settings size={18} aria-hidden="true" />
            Settings
          </a>
        </div>
      </aside>

      <div className="main-area">
        <header className="site-header">
          <div className="header-inner">
            <div className="header-center">
              <span className="header-page-title">Home</span>
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
            </div>

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
          <h1>Learn something useful today.</h1>
          <p className="intro-text">
            Explore clear, practical learning resources gathered in one place.
          </p>
        </main>
      </div>
    </div>
  );
}

export default App;
