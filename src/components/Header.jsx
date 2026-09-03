import React from 'react';
import { Moon } from 'lucide-react';

export default function Header({ theme, toggleTheme, activeTab, onNavigate }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-logo" onClick={() => onNavigate('home')} title="Return to home page">
          <div className="brand-title">Krishnan reads books.</div>
        </div>

        <nav className="header-nav-links">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate('about')}
          >
            About
          </button>
          <button 
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => onNavigate('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="header-actions">
          <button 
            className="theme-toggle-radio" 
            onClick={toggleTheme} 
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Moon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
