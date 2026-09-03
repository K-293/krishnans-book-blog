# 📚 Krishnan's Book Attic

A bespoke, high-performance, static Markdown-driven personal book blog. Features 3D realistic book covers, genre tag filtering, instant real-time search, article sorting, related article backlinks, reading progress indicators, and an interactive markdown drafter tool.

Zero database or CMS required—all articles are simple, plain-text Markdown files with YAML frontmatter.

---

## 🚀 Quick Start

### 1. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
npm run build
```
Generates a static production bundle in `dist/` ready to host anywhere.

---

## 📝 How to Add New Articles

### Option A: Interactive Live Drafter (Recommended)
1. Click **"Draft Article"** in the top navigation bar.
2. Interactively edit title, author, book rating, genres, and write your article in Markdown.
3. Preview the live 3D cover and rendered markdown in real-time.
4. Click **"Download .MD File"** and save it into the `public/posts/` folder!

### Option B: Manual Markdown File Addition
1. Create a new `.md` file in `public/posts/my-new-book.md`.
2. Add frontmatter metadata at the top:

```markdown
---
id: "my-new-book"
title: "My Thoughtful Review Title"
bookTitle: "Book Name"
bookAuthor: "Author Name"
author: "Krishnan"
date: "2026-09-02"
rating: 4.9
genres: ["Sci-Fi", "Philosophy"]
featured: true
readTime: "5 min read"
summary: "Short excerpt summarizing your thoughts on the book."
coverBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
---

## My First Chapter Review

Write your article here using standard markdown syntax.
```

3. Register your new post in `src/data/postsManifest.js` so it automatically appears in the main grid!

---

## 🌐 Deploying to Netlify

This project is pre-configured for **Netlify** with `netlify.toml`.

### 1-Click Netlify Git Deployment
1. Push this repository to GitHub or GitLab.
2. Go to [Netlify](https://app.netlify.com/) -> **Add new site** -> **Import an existing project**.
3. Select your repository.
4. Build settings will auto-detect from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Deploy Site**!

---

## ✨ Features & Architecture

- **3D Book Cover Component**: Dynamic 3D tilt, book spine depth, cover gloss sheen, page texture edges, and realistic shadows.
- **Reading Progress Bar & TOC**: Sticky scroll bar indicator + auto-generated Table of Contents for smooth navigation.
- **Backlinks & Related Reading**: Dynamically connects book reviews sharing similar genre tags.
- **Dark Library & Ivory Parchment Themes**: Toggleable visual themes optimized for long reading sessions.
- **Search & Filter Hygiene**: Instant fuzzy search across titles, summaries, authors, and tags. Multi-criteria sorting (Date, Rating, Title, Read time).
