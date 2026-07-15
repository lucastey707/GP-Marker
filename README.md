# GP Essay Marker

AI-powered marking and feedback tool for Singapore A-Level General Paper (GP) essays.

## Status: Phase 0 — Foundation

This project is in early setup. No student-facing features exist yet.
We are currently building the database and AI marking pipeline before
any visible pages.

## Getting Started (local development)

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the environment variable template and fill in real values:
   ```
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and paste in your actual Supabase and
   Anthropic credentials. This file is never committed to Git.

3. Run the development server:
   ```
   npm run dev
   ```
   Then open http://localhost:3000 in your browser.

## Project Structure

- `app/` — pages and API routes
- `lib/` — shared logic (database connection, AI pipeline, validation)
- `models/` — database table definitions
- `tests/` — automated tests

See the project PRD for full architecture details.
