import React from 'react';
import BookCard from './BookCard';

export default function FeaturedArticles({ posts, onSelectPost }) {
  if (!posts || posts.length === 0) return null;

  // Feature ONE book (the most recent one)
  const featuredPost = posts[0];

  return (
    <section className="recent-updates-section">
      <h2 className="recent-updates-heading">Recent updates</h2>

      <div className="recent-update-container" onClick={() => onSelectPost(featuredPost)}>
        <div className="recent-update-card-wrap">
          <BookCard post={featuredPost} onSelectPost={onSelectPost} />
        </div>

        <div className="recent-update-excerpt-wrap">
          <div className="recent-update-tag">Latest Review</div>
          <h3 className="recent-update-title">{featuredPost.title}</h3>
          <p className="recent-update-excerpt">{featuredPost.summary}</p>
          <div className="recent-update-read-more">Read article →</div>
        </div>
      </div>
    </section>
  );
}
