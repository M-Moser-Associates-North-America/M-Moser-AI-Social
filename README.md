# M Moser AI Hub

A Next.js app for helping M Moser Associates learn, share, and gamify practical AI workflows.

The app combines a public AI guide with an authenticated community feed. Users can publish prompts, add media, try each other's workflows, comment, like, save posts, earn points and badges, and appear on a leaderboard.

## Stack

- Next.js App Router
- React
- Supabase Auth, Database, and Storage
- Leapter MCP for gamification rewards, proxied through `/api/leapter`
- Tailwind CSS

This app does not call the Gemini API. Gemini appears in the guide content as one of the AI platforms discussed, but there is no Gemini runtime integration.

## Run Locally

Prerequisite: Node.js.

1. Install dependencies:
   `npm install`
2. Configure environment variables in `.env.local` or `.env` using `.env.example` as a reference.
3. Run the dev server:
   `npm run dev`

## Useful Commands

- `npm run dev` starts the local Next.js server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npx tsc --noEmit` runs TypeScript checks.

## Project Structure

- `app/` contains Next.js App Router routes, organized with route groups:
  - `app/(site)` is the public AI guide.
  - `app/(auth)` contains authentication pages.
  - `app/(community)` contains authenticated social features.
  - `app/(public)` contains public post detail routes.
  - `app/api` contains server-side API routes, including the Leapter proxy.
- `components/site/` contains public guide sections.
- `components/community/` contains feed, post, modal, and community UI.
- `components/layout/` contains shared app shell components.
- `components/providers/` contains app-level providers.
- `components/ui/` contains small reusable UI primitives.
- `data/ai-guide.ts` contains the checked-in AI guide content and post tool/discipline options.
- `lib/` contains shared application utilities and service clients.
- `supabase/migrations/` contains database migrations for the community app.

## Guide Content

The public AI guide content is local source data in `data/ai-guide.ts`. Supabase is used for auth, profiles, posts, comments, likes, saves, badges, storage-backed media, and gamification state. The guide does not require Supabase `platforms`, `ecosystems`, `roles`, or `use_cases` tables to render.

The previous `M-Moser-AI-Site-main` folder was a standalone Vite/HTML version of the homepage. It was removed because the top-level Next.js app now owns the production experience.
