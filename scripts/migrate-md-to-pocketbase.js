/**
 * One-time Migration Script: Local Markdown Files -> PocketBase CMS
 * Reads all .md files and postsManifest data, then uploads them to PocketBase via REST API.
 * 
 * Usage:
 *   POCKETBASE_URL=http://localhost:8090 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret node scripts/migrate-md-to-pocketbase.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { POSTS_MANIFEST } from '../src/data/postsManifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const POCKETBASE_URL = (process.env.POCKETBASE_URL || 'http://localhost:8090').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

/**
 * Basic YAML frontmatter parser for node script execution
 */
function parseFrontmatter(fileContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: fileContent };
  }

  const [, yamlString, body] = match;
  const frontmatter = {};

  yamlString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

async function getAdminToken() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.info('ℹ️  No ADMIN_EMAIL/ADMIN_PASSWORD provided. Attempting unauthenticated record creation...');
    return '';
  }

  try {
    const authUrl = `${POCKETBASE_URL}/api/admins/auth-with-password`;
    const res = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });

    if (!res.ok) {
      throw new Error(`Admin auth failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Successfully authenticated as Admin on PocketBase.');
    return data.token || '';
  } catch (err) {
    console.warn('⚠️ Admin authentication warning:', err.message);
    return '';
  }
}

async function runMigration() {
  console.log(`🚀 Migration started: Uploading posts to PocketBase instance at ${POCKETBASE_URL}...`);

  const adminToken = await getAdminToken();
  const headers = { 'Content-Type': 'application/json' };
  if (adminToken) {
    headers['Authorization'] = adminToken;
  }

  const endpoint = `${POCKETBASE_URL}/api/collections/posts/records`;
  let successCount = 0;
  let failCount = 0;

  for (const manifestPost of POSTS_MANIFEST) {
    const relativePath = manifestPost.path.replace(/^\//, '');
    const fullPath = path.join(PROJECT_ROOT, 'public', relativePath);

    let markdownBody = '';
    if (fs.existsSync(fullPath)) {
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { body } = parseFrontmatter(fileContent);
      markdownBody = body || fileContent;
    } else {
      console.warn(`⚠️ Markdown file not found at ${fullPath}. Using post summary fallback.`);
      markdownBody = manifestPost.summary || '';
    }

    const payload = {
      id: manifestPost.id,
      title: manifestPost.title,
      bookTitle: manifestPost.bookTitle,
      bookAuthor: manifestPost.bookAuthor,
      author: manifestPost.author,
      date: manifestPost.date,
      rating: manifestPost.rating,
      genres: manifestPost.genres,
      featured: manifestPost.featured,
      readTime: manifestPost.readTime,
      summary: manifestPost.summary,
      coverBg: manifestPost.coverBg,
      coverAccent: manifestPost.coverAccent,
      isbn: manifestPost.isbn,
      buyUrl: manifestPost.buyUrl,
      content: markdownBody
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.status === 200 || res.status === 201) {
        console.log(`✅ [${manifestPost.id}] "${manifestPost.bookTitle}" uploaded successfully.`);
        successCount++;
      } else {
        const errorText = await res.text();
        console.error(`❌ [${manifestPost.id}] Upload failed (HTTP ${res.status}): ${errorText}`);
        failCount++;
      }
    } catch (err) {
      console.error(`❌ [${manifestPost.id}] Network/Execution Error:`, err.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Migration Complete! ${successCount} succeeded, ${failCount} failed.`);
}

runMigration().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
