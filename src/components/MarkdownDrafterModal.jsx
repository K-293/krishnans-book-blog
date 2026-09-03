import React, { useState } from 'react';
import { X, Download, FileText, Sparkles, Copy, Check } from 'lucide-react';
import { renderMarkdownToHTML, calculateReadTime } from '../utils/markdownParser';
import BookCard from './BookCard';

export default function MarkdownDrafterModal({ isOpen, onClose, onAddDraftToBlog }) {
  const [title, setTitle] = useState("Why Great Books Change Our World");
  const [bookTitle, setBookTitle] = useState("The Hero with a Thousand Faces");
  const [bookAuthor, setBookAuthor] = useState("Joseph Campbell");
  const [author, setAuthor] = useState("Krishnan");
  const [rating, setRating] = useState(4.8);
  const [genres, setGenres] = useState("Mythology, Philosophy, Classic");
  const [summary, setSummary] = useState("An exploration of Joseph Campbell's monomyth pattern and how ancient mythologies continue to shape modern storytelling.");
  const [markdownBody, setMarkdownBody] = useState(`## The Universality of the Monomyth

Joseph Campbell's classic work explores the singular archetype underpinning heroic legends across every culture and era in human history.

> "A hero ventures forth from the world of common day into a region of supernatural wonder: fabulous forces are there encountered and a decisive victory is won."

### Key Stages of the Hero's Journey
1. **Departure**: The call to adventure and crossing the threshold.
2. **Initiation**: Road of trials, meeting the mentor, and supreme ordeal.
3. **Return**: Bringing the boon back to transform the community.

## Why This Matters Today

Whether analyzing *Star Wars*, *Dune*, or *The Lord of the Rings*, Campbell's framework provides the foundational DNA for legendary narratives.`);

  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const genresArray = genres.split(',').map(g => g.trim()).filter(Boolean);
  const readTime = calculateReadTime(markdownBody);
  const fileName = (bookTitle || title).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '.md';

  const fullMarkdownString = `---
id: "${(bookTitle || title).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}"
title: "${title}"
bookTitle: "${bookTitle}"
bookAuthor: "${bookAuthor}"
author: "${author}"
date: "${new Date().toISOString().split('T')[0]}"
rating: ${rating}
genres: [${genresArray.map(g => `"${g}"`).join(', ')}]
featured: false
readTime: "${readTime}"
summary: "${summary.replace(/"/g, '\\"')}"
coverBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
---

${markdownBody}`;

  const handleDownload = () => {
    const blob = new Blob([fullMarkdownString], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdownString);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleAddToBlog = () => {
    const draftPost = {
      id: (bookTitle || title).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      title,
      bookTitle,
      bookAuthor,
      author,
      date: new Date().toISOString().split('T')[0],
      rating: parseFloat(rating),
      genres: genresArray,
      featured: false,
      readTime,
      summary,
      coverBg: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
      coverAccent: "#60a5fa"
    };

    onAddDraftToBlog(draftPost, markdownBody);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} className="text-amber" />
            <span>Markdown Article Drafter & Live Preview</span>
          </div>
          <button className="clear-search-btn" onClick={onClose} style={{ position: 'static' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Editor vs Preview */}
        <div className="modal-body">
          {/* Editor Pane */}
          <div className="drafter-editor-pane">
            <div className="form-group">
              <label className="form-label">Article Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Book Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Book Author</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={bookAuthor} 
                  onChange={(e) => setBookAuthor(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Rating (1 - 5)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="1" 
                  max="5" 
                  className="form-input" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Genres (Comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={genres} 
                  onChange={(e) => setGenres(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Summary</label>
              <textarea 
                className="form-input" 
                style={{ minHeight: '60px', fontFamily: 'inherit' }}
                value={summary} 
                onChange={(e) => setSummary(e.target.value)} 
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Markdown Article Body</label>
              <textarea 
                className="form-textarea" 
                value={markdownBody} 
                onChange={(e) => setMarkdownBody(e.target.value)} 
                placeholder="Write your article in markdown..."
              />
            </div>
          </div>

          {/* Live Preview Pane */}
          <div className="drafter-preview-pane">
            <h4 className="form-label" style={{ marginBottom: '0.5rem' }}>Live 3D Book Cover Card Preview</h4>
            
            <BookCard
              post={{
                title,
                bookTitle,
                bookAuthor,
                author,
                date: new Date().toISOString().split('T')[0],
                rating: parseFloat(rating) || 5,
                genres: genresArray,
                readTime,
                summary,
                coverBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
              }}
              onSelectPost={() => {}}
            />

            <h4 className="form-label" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Live Rendered Article Body</h4>
            <div 
              className="markdown-body" 
              style={{ fontSize: '0.95rem' }}
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHTML(markdownBody) }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Target File: <code>public/posts/{fileName}</code>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="header-btn" onClick={handleCopy}>
              {copiedMd ? <Check size={16} className="text-amber" /> : <Copy size={16} />}
              <span>{copiedMd ? 'Copied Markdown' : 'Copy Markdown'}</span>
            </button>

            <button className="header-btn" onClick={handleDownload}>
              <Download size={16} />
              <span>Download .MD File</span>
            </button>

            <button className="header-btn header-btn-primary" onClick={handleAddToBlog}>
              <Sparkles size={16} />
              <span>Test Live in Blog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
