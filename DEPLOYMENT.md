# Vercel Deployment Guide

This guide provides steps to deploy the M Moser AI Hub to Vercel.

## 1. Prerequisites

- A [Vercel](https://vercel.com/) account.
- The project code pushed to a [GitHub](https://github.com/) repository.
- A [Supabase](https://supabase.com/) project with the database schema applied.

## 2. Environment Variables

During the Vercel deployment setup, you must configure the following environment variables in the **Environment Variables** section:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project Anon Key. |
| `LEAPTER_API_KEY` | Your Leapter API Key (for gamification). |
| `LEAPTER_MCP_URL` | The Leapter MCP Endpoint URL. |

> [!IMPORTANT]
> Ensure all keys are copied exactly as they appear in your service providers.

## 3. Deployment Steps

1.  **Import to Vercel**: Connect your GitHub account and import the repository.
2.  **Configure Project**:
    - Framework Preset: **Next.js**
    - Root Directory: `./` (Current directory)
3.  **Add Environment Variables**: Input the keys listed in the table above.
4.  **Deploy**: Click **Deploy**. Vercel will automatically build and serve your application.

## 4. Guide Content

The public AI guide content ships with the app in `data/ai-guide.ts`. Supabase does not need guide-content tables for the homepage to render.

---

## 5. Troubleshooting Build Errors

If the build fails on Vercel:
- **Lint Errors**: Run `npm run lint` locally and fix the reported files before redeploying.
- **Missing Env Vars**: Double-check that all environment variables are correctly spelled and included in the Vercel dashboard.
