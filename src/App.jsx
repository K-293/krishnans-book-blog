import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedArticles from './components/FeaturedArticles';
import BookCardComponent from './components/BookCard';
import FilterBar from './components/FilterBar';
import ArticleReader from './components/ArticleReader';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FieldNotesFooter from './components/FieldNotesFooter';
import MarkdownDrafterModal from './components/MarkdownDrafterModal';
import { POSTS_MANIFEST, ALL_GENRES } from './data/postsManifest';
import { fetchAllPosts, fetchArticleMarkdown } from './services/pocketbase';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'about' | 'contact'
  const [posts, setPosts] = useState(POSTS_MANIFEST);
  const [selectedPost, setSelectedPost] = useState(null);
  const [fullArticleContent, setFullArticleContent] = useState('');
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal State
  const [isDrafterOpen, setIsDrafterOpen] = useState(false);

  // Custom drafted articles in-memory cache
  const [draftContents, setDraftContents] = useState({});

  // Synchronize document root data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load posts on initial mount from PocketBase / local fallback
  useEffect(() => {
    fetchAllPosts()
      .then(loadedPosts => {
        if (loadedPosts && loadedPosts.length > 0) {
          setPosts(loadedPosts);
        }
      })
      .catch(err => {
        console.warn('Failed to load posts from API:', err);
      });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch or load full markdown content when an article is selected
  useEffect(() => {
    if (!selectedPost) return;

    if (draftContents[selectedPost.id]) {
      setFullArticleContent(draftContents[selectedPost.id]);
      return;
    }

    setIsLoadingArticle(true);
    fetchArticleMarkdown(selectedPost)
      .then(content => {
        setFullArticleContent(content);
      })
      .catch(() => {
        setFullArticleContent(selectedPost.summary || 'Article content coming soon.');
      })
      .finally(() => {
        setIsLoadingArticle(false);
      });
  }, [selectedPost, draftContents]);

  // Featured Posts (top 3 recent featured)
  const featuredPosts = useMemo(() => {
    return posts.filter(p => p.featured).slice(0, 3);
  }, [posts]);

  // Filtered & Sorted Posts Grid
  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter(post => {
        // Genre filter
        if (selectedGenre !== 'ALL' && (!post.genres || !post.genres.includes(selectedGenre))) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = post.title?.toLowerCase().includes(q);
          const matchBookTitle = post.bookTitle?.toLowerCase().includes(q);
          const matchAuthor = (post.author?.toLowerCase().includes(q)) || (post.bookAuthor?.toLowerCase().includes(q));
          const matchSummary = post.summary?.toLowerCase().includes(q);
          const matchTags = post.genres?.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchBookTitle || matchAuthor || matchSummary || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'title-asc') return (a.bookTitle || a.title).localeCompare(b.bookTitle || b.title);
        return 0;
      });
  }, [posts, searchQuery, selectedGenre, sortBy]);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('ALL');
    setSortBy('date-desc');
  };

  const handleAddDraftToBlog = (newDraft) => {
    setPosts(prev => [newDraft, ...prev]);
    setDraftContents(prev => ({ ...prev, [newDraft.id]: newDraft.markdownContent }));
    setSelectedPost(newDraft);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme}
        activeTab={selectedPost ? '' : activeTab}
        onNavigate={handleNavigate}
        onOpenDrafter={() => setIsDrafterOpen(true)}
      />

      {/* Main Page Body */}
      <main className="main-content-container">
        {selectedPost ? (
          isLoadingArticle ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Fetching article content...</p>
            </div>
          ) : (
            <ArticleReader 
              post={selectedPost} 
              fullContent={fullArticleContent}
              allPosts={posts}
              onBack={() => setSelectedPost(null)}
              onSelectPost={handleSelectPost}
              onTagClick={(tag) => {
                setSelectedPost(null);
                setActiveTab('home');
                setSelectedGenre(tag);
              }}
            />
          )
        ) : activeTab === 'about' ? (
          <AboutPage onNavigateHome={() => handleNavigate('home')} />
        ) : activeTab === 'contact' ? (
          <ContactPage />
        ) : (
          <>
            {/* Simple Hero Section */}
            <HeroSection />

            {/* Recent Updates (Single Book Feature 50/50 Split) */}
            {searchQuery === '' && selectedGenre === 'ALL' && (
              <FeaturedArticles
                posts={featuredPosts}
                onSelectPost={handleSelectPost}
                activeGenre={selectedGenre}
                onTagClick={(tag) => setSelectedGenre(tag)}
              />
            )}

            {/* Filter & Sort Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allGenres={ALL_GENRES}
              resultsCount={filteredAndSortedPosts.length}
              totalCount={posts.length}
              onResetFilters={handleResetFilters}
            />

            {/* Main Catalog Grid */}
            {filteredAndSortedPosts.length > 0 ? (
              <div className="field-notes-catalog-grid">
                {filteredAndSortedPosts.map((post) => (
                  <BookCardComponent
                    key={post.id}
                    post={post}
                    onSelectPost={handleSelectPost}
                    activeGenre={selectedGenre}
                    onTagClick={(tag) => setSelectedGenre(tag)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No articles found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  No book reviews match your search or filter criteria. Try clearing your filters or searching for another keyword.
                </p>
                <button
                  className="header-btn header-btn-primary"
                  onClick={handleResetFilters}
                  style={{ marginTop: '1.25rem' }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Field Notes Cardboard Footer */}
      <FieldNotesFooter onNavigate={handleNavigate} />

      {/* Interactive Drafter Modal */}
      <MarkdownDrafterModal
        isOpen={isDrafterOpen}
        onClose={() => setIsDrafterOpen(false)}
        onAddDraftToBlog={handleAddDraftToBlog}
      />
    </div>
  );
}
