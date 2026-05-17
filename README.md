# Recruiting Workflow App

A local recruiting workflow web app powered by Claude (claude-sonnet-4-20250514). Runs entirely in the browser — no backend required.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your Anthropic API key**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and replace `your_api_key_here` with your actual Anthropic API key.

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

7 sequential workflow stages accessible from the sidebar:

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Job Intake | Paste or upload a JD — Claude auto-populates a confirmation email template |
| 2 | Boolean Generator | Generate 5 LinkedIn Recruiter Boolean strings (2 title, 3 keyword) |
| 3 | Candidate Screener | Paste LinkedIn results — Claude rates each YES / MAYBE / NO against the JD |
| 4 | Outreach Generator | Personalized outreach message for a specific candidate |
| 5 | Clarification Message | Pre-call message for MAYBE candidates naming the gap |
| 6 | Candidate Writeup | Post-call writeup with exactly 6 bullets |
| 7 | Interview Prep Email | Full structured prep email for advancing candidates |

## Notes

- The JD parsed in Stage 1 is stored in memory and used automatically by all subsequent stages.
- PDF parsing uses [PDF.js](https://mozilla.github.io/pdf.js/) (browser-native). The `pdf-parse` npm package is Node.js-only and cannot run in a browser — `pdfjs-dist` is functionally equivalent and works locally.
- Word document parsing uses [mammoth](https://github.com/mwilliamson/mammoth.js) (browser-compatible).
- Your API key is stored only in `.env` and read at build/dev time by Vite. It is never sent anywhere except the Anthropic API.
- Streaming responses render progressively as Claude generates.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [Anthropic JS SDK](https://github.com/anthropic-ai/sdk-python) (`@anthropic-ai/sdk`)
- [Tailwind CSS](https://tailwindcss.com/)
- [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) for PDF parsing
- [mammoth](https://www.npmjs.com/package/mammoth) for Word parsing
