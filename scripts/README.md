# PocketBase Markdown Migration Script

This directory contains a one-time migration script that reads all existing `.md` files from `public/posts/` and uploads them directly into your PocketBase backend instance via API.

---

## How to Run

### 1. Ensure PocketBase is Running & Schema Created
Follow the instructions in `backend/README.md` to start PocketBase and create the `posts` collection schema.

### 2. Execute Migration

Run the script using Node.js from the project root:

```bash
POCKETBASE_URL=http://localhost:8090 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword node scripts/migrate-md-to-pocketbase.js
```

Or for a remote server:

```bash
POCKETBASE_URL=https://pocketbase.yourdomain.com ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword node scripts/migrate-md-to-pocketbase.js
```

### Output Example
```text
🚀 Migration started: Uploading posts to PocketBase instance at http://localhost:8090...
✅ Successfully authenticated as Admin on PocketBase.
✅ [dune] "Dune" uploaded successfully.
✅ [atomic-habits] "Atomic Habits" uploaded successfully.
✅ [shadow-of-the-wind] "The Shadow of the Wind" uploaded successfully.
✅ [project-hail-mary] "Project Hail Mary" uploaded successfully.
✅ [klara-and-the-sun] "Klara and the Sun" uploaded successfully.

🎉 Migration Complete! 5 succeeded, 0 failed.
```
