# PocketBase Backend Setup & Configuration Guide

This guide explains how to host PocketBase for **Krishnan reads books** using Docker Compose on any VPS (Hetzner, DigitalOcean, AWS, etc.).

---

## 1. Quick Start with Docker Compose

Run the following command inside the `backend/` directory to spin up PocketBase:

```bash
docker-compose up -d
```

PocketBase will be running on `http://localhost:8090` (or `http://YOUR_SERVER_IP:8090`).

---

## 2. Initial Admin Registration

1. Open `http://YOUR_SERVER_IP:8090/_/` in your browser.
2. Create your initial admin account (Email & Password).

---

## 3. Create the `posts` Collection Schema

In the PocketBase Admin UI:

1. Click **+ New Collection**.
2. Set **Collection Name**: `posts` (Type: **Base Collection**).
3. Add the following fields:

| Field Name | Type | Options / Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | System / Text | Plain text ID or slug | Unique post identifier (e.g. `dune`) |
| `title` | Text | Non-empty | Main article headline |
| `bookTitle` | Text | Non-empty | Book title |
| `bookAuthor` | Text | Non-empty | Author of the book |
| `author` | Text | Non-empty | Article author (e.g. `Krishnan`) |
| `date` | Date / Text | ISO format (`2026-08-25`) | Publication date |
| `rating` | Number | Min 0, Max 5 | Book rating (e.g. `5.0`) |
| `genres` | JSON | Array of strings | Genres (e.g. `["Sci-Fi", "Classic"]`) |
| `featured` | Bool | Default `false` | Featured single update flag |
| `readTime` | Text | Plain text | Read time string (e.g. `7 min read`) |
| `summary` | Text | Multi-line text | Short excerpt |
| `coverBg` | Text | CSS gradient string | Gradient background fallback |
| `coverAccent` | Text | Hex color string | Accent color |
| `isbn` | Text | Plain text | Book ISBN for Open Library cover fetch |
| `buyUrl` | Text | URL format | Link to Goodreads / purchase |
| `content` | Text / Editor | Markdown / HTML | Full markdown article text |

---

## 4. Set API Access Rules

To allow the frontend to read posts publicly without requiring user authentication:

1. Edit the `posts` collection settings.
2. In **API Rules**, set **List/Search Rule** to empty (allows public read access):
   ```
   ""
   ```
3. Set **View Rule** to empty (allows public view access):
   ```
   ""
   ```
4. Save the collection rules.

---

## 5. Connecting Frontend to PocketBase

Set the environment variable on Vercel or in your local `.env`:

```env
VITE_POCKETBASE_URL=https://your-pocketbase-domain.com
```
