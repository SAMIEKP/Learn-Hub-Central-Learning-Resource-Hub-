import { useState } from 'react';
import './App.css';

const recommendations = [
  { title: 'Biology Form 3 Notes', meta: 'Biology · Form 3', image: 'https://covers.openlibrary.org/isbn/9780857197689-L.jpg' },
  { title: 'Mathematics Past Papers', meta: 'Mathematics · Form 4', image: 'https://covers.openlibrary.org/isbn/9780241301868-L.jpg' },
  { title: 'Chichewa Revision Guide', meta: 'Languages · Form 2', image: 'https://covers.openlibrary.org/isbn/9780062916594-L.jpg' },
  { title: 'Science Study Handbook', meta: 'Science · Form 1', image: 'https://covers.openlibrary.org/isbn/9780141439570-L.jpg' },
];

const categories = [
  { name: 'Sciences', image: 'https://covers.openlibrary.org/isbn/9780857197689-M.jpg', color: 'category-purple' },
  { name: 'Mathematics', image: 'https://covers.openlibrary.org/isbn/9780262525671-M.jpg', color: 'category-cream' },
  { name: 'Languages', image: 'https://covers.openlibrary.org/isbn/9780062916594-M.jpg', color: 'category-blue' },
  { name: 'Social Studies', image: 'https://covers.openlibrary.org/isbn/9780062457738-M.jpg', color: 'category-orange' },
];

function App() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const handleMainScroll = (event) => {
    const scrollTop = event.currentTarget.scrollTop;
    setIsHeaderCompact((currentValue) => (
      currentValue ? scrollTop > 8 : scrollTop > 48
    ));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/" className="brand-link">
          <span className="brand-mark">LH</span>
          <span>Learn Hub</span>
        </a>

        <p className="sidebar-label">Main navigation</p>
        <nav aria-label="Sidebar navigation" className="sidebar-nav">
          <a href="#home" className="sidebar-link">Home</a>
          <a href="#library" className="sidebar-link">Library</a>
          <a href="#discover" className="sidebar-link active">Discover</a>
          <a href="#notifications" className="sidebar-link">Notifications</a>
          <a href="#profile" className="sidebar-link">Profile</a>
        </nav>

        <div className="sidebar-footer">
          <a href="#publisher-studio" className="sidebar-link">Publisher Studio</a>
          <a href="#settings" className="sidebar-link">Settings</a>
        </div>
      </aside>

      <main
        className="discovery-page"
        id="discover"
        onScroll={handleMainScroll}
      >
        <div className="discovery-top">
          <header className={`topbar${isHeaderCompact ? ' is-compact' : ''}`}>
          <div className="header-main">
            <div className="page-heading">
              <h1>Discover</h1>
            </div>
            <div className="header-search-row">
              <form className="book-search" role="search" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="category" className="visually-hidden">Choose a category</label>
                <select id="category" defaultValue="all">
                  <option value="all">All Categories</option>
                  <option value="money">Money & Investing</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
                <span className="search-divider" aria-hidden="true" />
                <label htmlFor="book-search-input" className="visually-hidden">Search books</label>
                <input id="book-search-input" type="search" placeholder="Find the book you like..." />
                <button type="submit">Search</button>
              </form>
              <span className="search-baseline" aria-hidden="true" />
            </div>
          </div>
          <div className="user-actions">
            <div className="user-avatar">DW</div>
            <span className="user-name">Davis Workman</span>
            <button type="button" className="notification-button" aria-label="View notifications">
              Notifications
              <span className="notification-dot" aria-hidden="true" />
            </button>
          </div>
          </header>
        </div>

        <div className="discovery-bottom">
          <section className="discovery-content">
          <nav className="discover-tabs" aria-label="Discover resource types">
            <a href="#all" className="active">All</a>
            <a href="#books">Books</a>
            <a href="#papers">Papers</a>
            <a href="#questions">Questions</a>
            <a href="#feed">Feed</a>
            <a href="#schools">Schools</a>
          </nav>
          <p className="discovery-purpose">
            Find books, past papers, notes, revision guides, and video tutorials from verified schools and teachers.
          </p>
          <section className="shelf-section recommendation-section" aria-labelledby="recommendations-heading">
            <div className="section-heading">
              <h2 id="recommendations-heading">Book Recommendation</h2>
              <a href="#all-books" className="view-all">View all</a>
            </div>
            <div className="recommendation-shelf">
              {recommendations.map((book) => (
                <article className="book-card" key={book.title}>
                  <img className="book-cover" src={book.image} alt={`${book.title} cover`} />
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p>{book.meta}</p>
                  </div>
                  <button type="button" className="save-book" aria-label={`Save ${book.title}`}>Save</button>
                </article>
              ))}
            </div>
          </section>

          <section className="shelf-section category-section" id="categories" aria-labelledby="categories-heading">
            <div className="section-heading">
              <h2 id="categories-heading">Resource Categories</h2>
              <button type="button" className="more-button" aria-label="More category options">More</button>
            </div>
            <div className="category-shelf">
              {categories.map((category) => (
                <a href={`#${category.name.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="category-card" key={category.name}>
                  <span className={`category-image ${category.color}`}><img src={category.image} alt="" /></span>
                  <strong>{category.name}</strong>
                </a>
              ))}
            </div>
          </section>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
