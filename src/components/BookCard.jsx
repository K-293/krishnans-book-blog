import React, { useState } from 'react';

export default function BookCard({ post, onSelectPost }) {
  const {
    title,
    bookTitle,
    bookAuthor,
    author,
    isbn,
    coverBg,
    coverUrl
  } = post;

  const displayTitle = bookTitle || title;
  const displayAuthor = bookAuthor || author;

  const primaryCoverSrc = coverUrl || (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="field-notes-catalog-item" 
      onClick={() => onSelectPost(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelectPost(post)}
    >
      {/* Notebook Shaped Window Frame */}
      <div className="field-notebook-frame">
        {/* Spine Overlay */}
        <div className="notebook-spine-overlay" />

        {/* Cover Image Stage */}
        <div 
          className="notebook-cover-stage-img"
          style={{ background: coverBg || 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)' }}
        >
          {primaryCoverSrc && !imageError ? (
            <img 
              src={primaryCoverSrc} 
              alt={displayTitle}
              className="notebook-cover-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="notebook-cover-fallback">
              <div className="notebook-inner-title">{displayTitle}</div>
              <div className="notebook-inner-author">BY {displayAuthor}</div>
            </div>
          )}
        </div>
      </div>

      {/* Item info below Notebook Window: Title & Author only */}
      <div className="field-notes-item-info">
        <h3 className="field-notes-item-title">{displayTitle}</h3>
        <div className="field-notes-item-author">{displayAuthor}</div>
      </div>
    </div>
  );
}
