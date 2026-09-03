import React from 'react';
import { BookMarked, Rss, ArrowUp, Globe, Mail } from 'lucide-react';

export default function FieldNotesFooter({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="field-cardboard-footer">
      <div className="cardboard-texture-overlay" />
      
      <div className="footer-inner-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <h3 className="footer-brand-title">Krishnan reads books.</h3>
            <p className="footer-brand-desc">
              A personal book review journal & reading log. In-depth critical analysis and distilled thoughts on literature.
            </p>
            <div className="footer-motto-stamp">
              FIELD JOURNAL • EST. 2026
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => { onNavigate('home'); scrollToTop(); }}>Home</button>
              </li>
              <li>
                <button onClick={() => { onNavigate('home'); scrollToTop(); }}>Recent Updates</button>
              </li>
              <li>
                <button onClick={() => { onNavigate('about'); scrollToTop(); }}>About Krishnan</button>
              </li>
              <li>
                <button onClick={() => { onNavigate('contact'); scrollToTop(); }}>Contact Me</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Literary Genres */}
          <div className="footer-col">
            <h4 className="footer-col-title">Focus Areas</h4>
            <ul className="footer-links-list">
              <li><span>Science Fiction & Speculative</span></li>
              <li><span>Psychology & Mental Models</span></li>
              <li><span>Philosophy & Epistemology</span></li>
              <li><span>Classics & Mystery</span></li>
            </ul>
          </div>

          {/* Column 4: Social & Connect */}
          <div className="footer-col social-col">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter / X" aria-label="Twitter">
                <Globe size={18} />
              </a>
              <a href="https://goodreads.com" target="_blank" rel="noopener noreferrer" title="Goodreads" aria-label="Goodreads">
                <BookMarked size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
                <Mail size={18} />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Substack RSS Feed coming soon!"); }} title="RSS Feed" aria-label="RSS Feed">
                <Rss size={18} />
              </a>
            </div>
            <p className="footer-social-note">
              Follow along for new reviews & reading notes.
            </p>
          </div>
        </div>

        {/* Footer Divider & Bottom Row */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {currentYear} Krishnan reads books. All rights reserved.
          </div>
          
          <div className="footer-crafted-tag">
            Handcrafted for bibliophiles, thinkers, & readers.
          </div>

          <button className="scroll-to-top-btn" onClick={scrollToTop} title="Back to top" aria-label="Back to top">
            <ArrowUp size={16} />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
