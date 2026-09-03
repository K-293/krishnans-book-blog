/**
 * PocketBase API Service Layer
 * Supports decoupled PocketBase backend integration with automatic fallback to local static posts.
 */

import { POSTS_MANIFEST } from '../data/postsManifest';
import { parseFrontmatter } from '../utils/markdownParser';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || '';

/**
 * Normalizes a PocketBase record or local post object into standard App post format.
 */
function normalizePost(record) {
  return {
    id: record.id || record.slug,
    path: record.path || `/posts/${record.id || record.slug}.md`,
    title: record.title,
    bookTitle: record.bookTitle,
    bookAuthor: record.bookAuthor,
    author: record.author || 'Krishnan',
    date: record.date || new Date().toISOString().split('T')[0],
    rating: typeof record.rating === 'number' ? record.rating : parseFloat(record.rating) || 5.0,
    genres: Array.isArray(record.genres) ? record.genres : (typeof record.genres === 'string' ? JSON.parse(record.genres) : []),
    featured: Boolean(record.featured),
    readTime: record.readTime || '5 min read',
    summary: record.summary || '',
    coverBg: record.coverBg || 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)',
    coverAccent: record.coverAccent || '#9c3e14',
    isbn: record.isbn || '',
    buyUrl: record.buyUrl || '',
    content: record.content || ''
  };
}

/**
 * Fetches all posts from PocketBase backend if configured, otherwise returns local posts manifest.
 */
export async function fetchAllPosts() {
  if (!POCKETBASE_URL) {
    console.info('[PocketBase Service] VITE_POCKETBASE_URL is not set. Using local posts manifest.');
    return POSTS_MANIFEST.map(normalizePost);
  }

  try {
    const endpoint = `${POCKETBASE_URL.replace(/\/$/, '')}/api/collections/posts/records?sort=-date`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`PocketBase HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map(normalizePost);
    }

    console.warn('[PocketBase Service] PocketBase collection returned 0 items. Falling back to local manifest.');
    return POSTS_MANIFEST.map(normalizePost);
  } catch (error) {
    console.warn('[PocketBase Service] Could not connect to PocketBase server. Using local fallback.', error.message);
    return POSTS_MANIFEST.map(normalizePost);
  }
}

/**
 * Fetches full markdown body for a post (from PocketBase content field or local .md file).
 */
export async function fetchArticleMarkdown(post) {
  if (post && post.content && post.content.trim().length > 0) {
    return post.content;
  }

  if (!post || !post.path) {
    return post?.summary || 'Article content unavailable.';
  }

  try {
    const response = await fetch(post.path);
    if (!response.ok) throw new Error(`Failed to load markdown from ${post.path}`);
    const text = await response.text();
    const { body } = parseFrontmatter(text);
    return body || text;
  } catch (err) {
    console.warn('[PocketBase Service] Failed to load local markdown file:', err.message);
    return post.summary || 'Article content coming soon.';
  }
}
