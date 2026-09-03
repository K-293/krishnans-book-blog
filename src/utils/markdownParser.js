import { marked } from 'marked';

/**
 * Custom YAML frontmatter parser for markdown content
 */
export function parseFrontmatter(rawContent) {
  if (!rawContent) return { frontmatter: {}, body: '' };

  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: rawContent };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const frontmatter = {};

  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Clean up quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse arrays e.g. ["Sci-Fi", "Fiction"] or [Sci-Fi, Fiction]
      if (value.startsWith('[') && value.endsWith(']')) {
        const rawArray = value.slice(1, -1);
        value = rawArray.split(',').map(item => {
          let cleaned = item.trim();
          if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1);
          }
          return cleaned;
        }).filter(Boolean);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        value = Number(value);
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

/**
 * Calculates estimated reading time for markdown body
 */
export function calculateReadTime(text) {
  if (!text) return '1 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Extracts Table of Contents from markdown header tokens
 */
export function extractTableOfContents(markdownBody) {
  if (!markdownBody) return [];

  const headers = [];
  const lines = markdownBody.split('\n');

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length; // 2 for h2, 3 for h3
      const text = headingMatch[2].replace(/[\*\_\`]/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headers.push({ id, text, level });
    }
  });

  return headers;
}

/**
 * Configure marked renderer to attach IDs to headings for smooth scrolling TOC
 */
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
  // Handle object or string text format depending on marked version
  const rawText = typeof text === 'object' && text.text ? text.text : String(text);
  const cleanText = rawText.replace(/[\*\_\`]/g, '').trim();
  const id = cleanText
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return `<h${level} id="${id}">${rawText}</h${level}>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

/**
 * Converts markdown string to sanitized HTML string
 */
export function renderMarkdownToHTML(markdownText) {
  if (!markdownText) return '';
  return marked.parse(markdownText);
}

/**
 * Finds related posts by matching shared genre tags
 */
export function getRelatedPosts(currentPost, allPosts, limit = 3) {
  if (!currentPost || !allPosts) return [];

  const currentGenres = currentPost.genres || [];

  return allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => {
      const postGenres = post.genres || [];
      const sharedCount = postGenres.filter(g => currentGenres.includes(g)).length;
      return { post, sharedCount };
    })
    .filter(item => item.sharedCount > 0)
    .sort((a, b) => b.sharedCount - a.sharedCount || new Date(b.post.date) - new Date(a.post.date))
    .slice(0, limit)
    .map(item => item.post);
}
