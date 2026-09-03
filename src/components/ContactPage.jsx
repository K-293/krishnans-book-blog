import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Globe, BookMarked, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Book Recommendation',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-page-container">
      <header className="contact-header">
        <h1 className="contact-title">Contact Me</h1>
        <p className="contact-subtitle">
          Have a book recommendation, literary inquiry, or thoughts on a review? I'd love to hear from you.
        </p>
      </header>

      <div className="contact-grid">
        {/* Left Column: Form */}
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success-card">
              <CheckCircle size={40} className="success-icon" />
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out, {formData.name}. I'll get back to you shortly.</p>
              <button 
                className="contact-reset-btn"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'Book Recommendation', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input 
                  id="contact-name"
                  type="text" 
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input 
                  id="contact-email"
                  type="email" 
                  required
                  placeholder="e.g. elena@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Topic / Subject</label>
                <select 
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Book Recommendation">Book Recommendation</option>
                  <option value="Review Discussion">Review Discussion</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Literary Collaboration">Literary Collaboration</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea 
                  id="contact-message"
                  rows={5}
                  required
                  placeholder="Share your thoughts or recommend a book..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Direct Touchpoints */}
        <div className="contact-sidebar">
          <div className="contact-info-card">
            <h3>Direct Touchpoints</h3>
            <p>You can also reach out or connect directly via social and literary networks:</p>

            <ul className="contact-links-list">
              <li>
                <Mail size={18} />
                <span>krishnan@readsbooks.dev</span>
              </li>
              <li>
                <Globe size={18} />
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">@krishnan_reads</a>
              </li>
              <li>
                <BookMarked size={18} />
                <a href="https://goodreads.com" target="_blank" rel="noopener noreferrer">Goodreads Profile</a>
              </li>
              <li>
                <Globe size={18} />
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub / Code</a>
              </li>
            </ul>
          </div>

          <div className="contact-note-card">
            <MessageSquare size={20} />
            <p>
              "Recommendations are always welcome — especially hidden sci-fi gems, profound psychological studies, or classical philosophy."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
