import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { searchResources } from '../api/client';

function resourceMeta(resource) {
  return [resource.subject, resource.form, resource.topic]
    .filter(Boolean)
    .join(' · ');
}

export default function ResourceSearch({ compact = false, onOpenResource, onInputFocus }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const searchQuery = query.trim();
    if (!searchQuery || isLoading) return;

    setSubmittedQuery(searchQuery);
    setIsLoading(true);
    setError('');
    try {
      const response = await searchResources(searchQuery);
      if (!Array.isArray(response?.results)) {
        throw new Error('Invalid resource search response');
      }
      setResults(response.results);
    } catch {
      setResults([]);
      setError('Resource search is temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resource-search-container">
      <form className="book-search" role="search" onSubmit={handleSubmit}>
        <label htmlFor="category" className="visually-hidden">Choose a category</label>
        <select id="category" defaultValue="all">
          <option value="all">All Categories</option>
          <option value="sciences">Sciences &amp; STEM</option>
          <option value="math">Mathematics</option>
          <option value="languages">Languages &amp; Literature</option>
          <option value="social">Social Studies</option>
          <option value="business">Business &amp; Commerce</option>
        </select>
        <span className="search-divider" aria-hidden="true" />
        <label htmlFor="book-search-input" className="visually-hidden">Search books</label>
        <input
          id="book-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={onInputFocus}
          placeholder="Find books, past papers, notes..."
        />
        <button
          type="submit"
          className="search-submit-btn"
          aria-label="Search approved resources"
          title="Search"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? 'Searching…' : compact ? <IconSearch size={16} stroke={2} /> : 'Search'}
        </button>
      </form>
      {(isLoading || error || submittedQuery) && (
        <section className="resource-search-results" aria-label="Resource search results" aria-live="polite">
          {isLoading ? (
            <p role="status">Searching approved resources…</p>
          ) : error ? (
            <p className="resource-search-error" role="alert">{error}</p>
          ) : results.length ? (
            <>
              <p className="resource-search-summary">{results.length} approved resource{results.length === 1 ? '' : 's'} for “{submittedQuery}”</p>
              <ul>
                {results.map((resource) => (
                  <li key={resource.id || resource.title}>
                    <button
                      type="button"
                      onClick={() => onOpenResource({
                        resource_id: resource.id,
                        title: resource.title,
                        subject: resource.subject,
                        topic: resource.topic,
                        resource_type: resource.resource_type,
                      })}
                    >
                      <strong>{resource.title}</strong>
                      {resourceMeta(resource) && <span>{resourceMeta(resource)}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No approved resources found for “{submittedQuery}”.</p>
          )}
        </section>
      )}
    </div>
  );
}
