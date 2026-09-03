import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Clock, Calendar, ExternalLink, Share2, Bookmark, Check } from 'lucide-react';
import { renderMarkdownToHTML, getRelatedPosts, calculateReadTime } from '../utils/markdownParser';
import BookCard from './BookCard';

export default function ArticleReader({ post, fullContent, allPosts, onBack, onSelectPost, onTagClick }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    title,
    subtitle,
    bookTitle,
    bookAuthor,
    author,
    date,
    rating,
    genres,
    buyUrl
  } = post;

  const htmlContent = renderMarkdownToHTML(fullContent || post.summary || '');
  const relatedPosts = getRelatedPosts(post, allPosts, 3);
  const calculatedReadTime = calculateReadTime(fullContent);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out Krishnan's review of "${post.bookTitle}": ${post.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="reader-container">
      {/* Reading Progress Indicator */}
      <div className="reading-progress-container">
        <div 
          className="reading-progress-bar" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* Back Navigation */}
      <nav className="reader-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Stories</span>
        </button>
      </nav>

      {/* Medium Clean Article Header */}
      <header className="reader-header-clean">
        <div className="genre-tags-list" style={{ marginBottom: '1rem' }}>
          {genres && genres.map(tag => (
            <span 
              key={tag} 
              className="tag-chip tag-chip-active"
              onClick={() => onTagClick && onTagClick(tag)}
              style={{ cursor: 'pointer' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="reader-title">{title}</h1>
        {subtitle && <p className="reader-subtitle">{subtitle}</p>}

        {/* Medium Author Profile Bar */}
        <div className="reader-author-bar">
          <div className="author-profile-info">
            <div className="author-avatar">{author ? author[0] : 'K'}</div>
            <div>
              <div className="author-name">{author}</div>
              <div className="post-publish-meta">
                <span>Book: <strong>{bookTitle}</strong> by {bookAuthor}</span>
                <span>•</span>
                <span>★ {rating?.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{calculatedReadTime} • {date}</span>
            
            {buyUrl && (
              <a 
                href={buyUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="header-btn"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                title="Goodreads link"
              >
                <ExternalLink size={14} />
              </a>
            )}

            <button 
              className="header-btn" 
              onClick={handleShare}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            >
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
            </button>

            <button 
              className="header-btn" 
              onClick={() => setIsBookmarked(!isBookmarked)}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            >
              <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered Print Article Body */}
      <article 
        className="markdown-body" 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Related Backlinks */}
      {relatedPosts.length > 0 && (
        <section className="related-posts-section">
          <div className="section-header">
            <h2 className="section-title">More Stories & Reviews</h2>
          </div>
          <div className="featured-grid">
            {relatedPosts.map((relatedPost) => (
              <BookCard
                key={relatedPost.id}
                post={relatedPost}
                onSelectPost={(p) => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectPost(p);
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
