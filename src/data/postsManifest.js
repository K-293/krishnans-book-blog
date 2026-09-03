/**
 * Post Manifest for Krishnan's Book Blog.
 * Contains list of markdown post IDs and paths.
 * New markdown files placed in /public/posts/ can be registered here.
 */

export const POSTS_MANIFEST = [
  {
    id: "dune",
    path: "/posts/dune.md",
    title: "The Golden Path of Power: Reflecting on Frank Herbert's Dune",
    bookTitle: "Dune",
    bookAuthor: "Frank Herbert",
    author: "Krishnan",
    date: "2026-08-25",
    rating: 5.0,
    genres: ["Sci-Fi", "Classic", "Philosophy"],
    featured: true,
    readTime: "7 min read",
    summary: "Frank Herbert's 1965 masterpiece remains the definitive triumph of world-building. A deep dive into Paul Atreides' terrifying ascension and why Dune is a warning against charismatic leaders.",
    coverBg: "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
    coverAccent: "#f59e0b",
    isbn: "978-0441172719",
    buyUrl: "https://www.goodreads.com/book/show/234225.Dune"
  },
  {
    id: "atomic-habits",
    path: "/posts/atomic-habits.md",
    title: "Small Choices, Compounding Outcomes: Notes on Atomic Habits",
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    author: "Krishnan",
    date: "2026-08-20",
    rating: 4.8,
    genres: ["Self-Improvement", "Psychology", "Non-Fiction"],
    featured: true,
    readTime: "5 min read",
    summary: "An actionable breakdown of James Clear's landmark behavioral blueprint. Learn why focusing on systems rather than goals is the key to sustainable habit formation.",
    coverBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    coverAccent: "#60a5fa",
    isbn: "978-0735211292",
    buyUrl: "https://www.goodreads.com/book/show/37570586-atomic-habits"
  },
  {
    id: "shadow-of-the-wind",
    path: "/posts/shadow-of-the-wind.md",
    title: "The Cemetery of Forgotten Books: A Love Letter to Zafón's Masterpiece",
    bookTitle: "The Shadow of the Wind",
    bookAuthor: "Carlos Ruiz Zafón",
    author: "Krishnan",
    date: "2026-08-14",
    rating: 4.9,
    genres: ["Mystery", "Historical Fiction", "Literary"],
    featured: true,
    readTime: "6 min read",
    summary: "Carlos Ruiz Zafón's hauntingly beautiful novel set in 1945 Barcelona is a spellbinding ode to the power of books, secret libraries, and lost authors.",
    coverBg: "linear-gradient(135deg, #4c1d95 0%, #831843 100%)",
    coverAccent: "#c084fc",
    isbn: "978-0143034902",
    buyUrl: "https://www.goodreads.com/book/show/1232.The_Shadow_of_the_Wind"
  },
  {
    id: "project-hail-mary",
    path: "/posts/project-hail-mary.md",
    title: "Solving Extinction One Equation at a Time: Project Hail Mary",
    bookTitle: "Project Hail Mary",
    bookAuthor: "Andy Weir",
    author: "Krishnan",
    date: "2026-08-05",
    rating: 4.9,
    genres: ["Sci-Fi", "Adventure", "Fiction"],
    featured: false,
    readTime: "6 min read",
    summary: "Ryland Grace wakes up millions of miles from Earth with amnesia and a dead crew. Andy Weir delivers a thrilling sci-fi survival tale powered by science and an unforgettable friendship.",
    coverBg: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
    coverAccent: "#34d399",
    isbn: "978-0593135204",
    buyUrl: "https://www.goodreads.com/book/show/54493401-project-hail-mary"
  },
  {
    id: "klara-and-the-sun",
    path: "/posts/klara-and-the-sun.md",
    title: "Artificial Eyes, Human Hearts: Reviewing Klara and the Sun",
    bookTitle: "Klara and the Sun",
    bookAuthor: "Kazuo Ishiguro",
    author: "Krishnan",
    date: "2026-07-28",
    rating: 4.7,
    genres: ["Dystopian", "Sci-Fi", "Philosophy"],
    featured: false,
    readTime: "5 min read",
    summary: "Nobel laureate Kazuo Ishiguro explores what it truly means to love through the innocent, observant gaze of Klara, a solar-powered Artificial Friend.",
    coverBg: "linear-gradient(135deg, #854d0e 0%, #eab308 100%)",
    coverAccent: "#fef08a",
    isbn: "978-0593318171",
    buyUrl: "https://www.goodreads.com/book/show/54120408-klara-and-the-sun"
  }
];

export const ALL_GENRES = Array.from(
  new Set(POSTS_MANIFEST.flatMap(post => post.genres))
).sort();
