import React from 'react';
import { Search, X, SlidersHorizontal, Tag } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  allGenres,
  resultsCount,
  totalCount,
  onResetFilters
}) {
  return (
    <div className="filter-control-bar">
      <div className="filter-top-row">
        {/* Search Input */}
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search titles, authors, reviews, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchQuery('')}
              title="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="sort-select-wrap">
          <SlidersHorizontal size={16} className="text-muted" />
          <span className="sort-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="readtime-asc">Quickest Read</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="filter-tags-row">
        <span 
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.4rem' }}
        >
          <Tag size={14} /> Genres:
        </span>

        <button
          className={`filter-tag-chip ${selectedGenre === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedGenre('ALL')}
        >
          All Genres ({totalCount})
        </button>

        {allGenres.map((genre) => (
          <button
            key={genre}
            className={`filter-tag-chip ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(selectedGenre === genre ? 'ALL' : genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results Count & Reset */}
      {(selectedGenre !== 'ALL' || searchQuery !== '') && (
        <div className="results-count-bar">
          <span>
            Showing <strong>{resultsCount}</strong> of <strong>{totalCount}</strong> articles
            {selectedGenre !== 'ALL' && <> in <em>#{selectedGenre}</em></>}
            {searchQuery && <> matching "<em>{searchQuery}</em>"</>}
          </span>
          <button 
            className="header-btn" 
            onClick={onResetFilters}
            style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
