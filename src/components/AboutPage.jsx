import React from 'react';
import { BookOpen, Feather, Compass, Heart } from 'lucide-react';

export default function AboutPage({ onNavigateHome }) {
  return (
    <div className="about-page-container">
      <header className="about-header">
        <h1 className="about-title">About Krishnan</h1>
        <p className="about-subtitle">
          A personal repository of distilled thoughts, critical analysis, and notes on literature.
        </p>
      </header>

      <section className="about-content-grid">
        <div className="about-main-text">
          <p className="about-paragraph lead-paragraph">
            Welcome to <em>Krishnan reads books</em>. This journal was created out of a deep conviction that reading is not merely passive consumption, but an active, transformative conversation with the greatest minds across centuries.
          </p>

          <blockquote className="about-quote">
            "A book must be the axe for the frozen sea within us."
            <cite>— Franz Kafka</cite>
          </blockquote>

          <p className="about-paragraph">
            Here you will find thoughtful reviews and analytical notes spanning speculative science fiction, cognitive psychology, philosophical treatises, and timeless fiction. Each essay aims to extract core mental models, narrative techniques, and philosophical questions worth pondering.
          </p>

          <h2 className="about-section-heading">Core Interests & Focus</h2>
          <ul className="about-interests-list">
            <li><strong>Sci-Fi & Speculative Fiction:</strong> World-building, AI consciousness, humanity's cosmic posture (Herbert, Weir, Ishiguro).</li>
            <li><strong>Psychology & Human Behavior:</strong> Habits, decision making, cognitive biases, and self-mastery (Clear, Kahneman).</li>
            <li><strong>Classics & Mystery:</strong> Gothic atmosphere, labyrinthine plots, and timeless prose (Zafón, Dostoyevsky).</li>
            <li><strong>Philosophy & Epistemology:</strong> Stoicism, existentialism, and ethics for modern living.</li>
          </ul>
        </div>

        <div className="about-sidebar">
          <div className="about-card">
            <h3 className="about-card-title"><BookOpen size={18} /> Current Reading</h3>
            <p className="about-card-text">
              Currently delving into deep-time ecology, early 20th-century European fiction, and modern behavioral physics.
            </p>
          </div>

          <div className="about-card">
            <h3 className="about-card-title"><Feather size={18} /> Writing Philosophy</h3>
            <p className="about-card-text">
              Honest, un-hyped reviews. No star ratings given lightly. Focus on lasting ideas over trendiness.
            </p>
          </div>

          <div className="about-card">
            <h3 className="about-card-title"><Compass size={18} /> Navigation</h3>
            <button className="about-home-btn" onClick={onNavigateHome}>
              Explore Book Catalog →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
