# How I Built the Lawrence Harvey Recruiting OS
## A complete step-by-step guide — from idea to finished app

---

## What this is

A local web app that automates the most time-consuming writing tasks in recruiting. You paste in a job description once and it handles confirmation emails, Boolean search strings, candidate screening, outreach messages, clarification notes, candidate writeups, and full interview prep emails — all powered by Claude AI, all editable before you copy.

This document covers exactly how it was built, every update that was made, and every issue that came up along the way.

---

## Phase 1: Planning (in Claude.ai chat, before any code)

Before opening Claude Code, the full scope was figured out in a regular Claude chat.

### Step 1 — Describe the recruiting workflow and ask what's missing

The initial concept covered 6 stages. The chat response identified these gaps worth adding:

- **Interview prep** — the most time-consuming write that Claude can knock out in minutes
- A submission email layer (for packaging multiple candidates to send to a client)
- Client feedback tracking
- Search status update emails

The decision was to add interview prep as Stage 7 and keep the rest for later.

### Step 2 — Get the full build prompt

After clarifying each stage and getting the exact format templates nailed down, the final prompt was assembled. Key things that were refined in the chat before building:

- **Stage 4 (Outreach):** Provided an approved example message (the "Vlad" infrastructure architect message) so the format was locked in exactly — not templated, peer-to-peer tone, specific bullets, logistics section, Jason Wolpow signoff
- **Stage 5 (Clarification):** Provided the exact template structure word for word so Claude Code would follow it precisely
- **Model choice:** Sonnet 4 at medium thinking — Haiku too flat for Stage 5/7, Opus overkill and slow, Sonnet hits the sweet spot
- **Stage 7 (Interview Prep):** Based on an internal Lawrence Harvey guide on using AI for candidate prep

---

## Phase 2: The Build Prompt

This is the exact prompt that was pasted into Claude Code to build the entire app in one shot:

---

> Build me a local recruiting workflow web app. Single React app, no backend required — runs in the browser locally. Use the Anthropic JS SDK to power all AI features (model: claude-sonnet-4-20250514). Store the API key in a .env file.
>
> The app has 7 sequential workflow stages shown as a dark sidebar navigation with stage numbers and labels. Main content area is white/light. The JD parsed in Stage 1 persists in memory across all stages without the user re-pasting it. All outputs are editable textareas before copying. Show a subtle loading/streaming state while Claude generates. No modal popups — outputs appear inline below inputs.
>
> **STAGE 1: Job Intake**
> Accept a JD via text paste or PDF/Word file upload. Parse and auto-populate this editable job confirmation email template. Fields Claude cannot determine stay blank:
>
> Hi,
> Thank you for your time today. As discussed, if you can confirm the details below this will form the basis of the search that we conduct. Feel free to add/edit anything as you see fit.
> Title: / Reporting to: / Business need for the hire: / Wider team and where this role sits: / Essential skills required to interview a candidate: / Questions to screen candidates: / Interview Process: / Selling points of the role/company: / Location: / Salary: / Benefits: / Bonus: / Visa Sponsorship/Relocation package etc: / Ideal Start Date: / CV Feedback & Interview Feedback agreed SLAs:
> As soon as you respond confirming the above, we will begin the search. Best,
>
> Editable inline. Copy button. JD content stored in app state for all subsequent stages.
>
> **STAGE 2: Boolean Generator** — 5 LinkedIn Recruiter Boolean strings. Two title-focused (Title Search 1, Title Search 2). Three keyword-focused (Keyword Search 1, 2, 3). Each has its own copy button.
>
> **STAGE 3: Candidate Screener** — Paste raw LinkedIn results up to 25 per batch. Claude rates each YES / MAYBE / NO. Results accumulate across batches. Clear list button. Default to MAYBE when tenure or match is unclear.
>
> **STAGE 4: Outreach Generator** — [Full template with Vlad example as format anchor — peer tone, anonymous company, no em dashes, no bold, bullets from JD, logistics, Jason Wolpow signoff]
>
> **STAGE 5: Clarification Message** — [Exact template: "Hi [Name] - really appreciate you responding..." structure, under 200 words, single closing question, no em dashes]
>
> **STAGE 6: Candidate Writeup** — [Exactly 6 bullets, factual, no overselling]
>
> **STAGE 7: Interview Prep Email** — [6 sections: company, interviewer, what to expect, how to tie in experience, questions to ask, logistics. Long-form, no em dashes, no bold]
>
> Technical: @anthropic-ai/sdk, VITE_ANTHROPIC_API_KEY, model claude-sonnet-4-20250514, max_tokens 2000, streaming, pdfjs-dist for PDF, mammoth for Word.

---

## Phase 3: First Run Issues and Fixes

### Issue 1 — Model not found (404 error)

After the app was built and running, Stage 1 returned:

```
404 {"type":"error","error":{"type":"not_found_error","message":"model: claude-sonnet-4-20250514"}}
```

**Fix:** The model name `claude-sonnet-4-20250514` doesn't exist. The correct model ID is `claude-sonnet-4-6`. Updated in `src/anthropic.js`:

```js
export const MODEL = 'claude-sonnet-4-6';
```

### Issue 2 — App can't read .env on StackBlitz

StackBlitz doesn't load `.env` files the same way local development does, so `VITE_ANTHROPIC_API_KEY` was undefined and the Anthropic client threw an authentication error.

**Fix:** Added an API key gate screen. When the app loads and no key is found in the environment or sessionStorage, it shows a prompt before the main app. The key is saved to `sessionStorage` for that tab only — never committed to the repo.

This means:
- No `.env` file needed on StackBlitz
- Works anywhere (StackBlitz, Codespaces, locally)
- Key is only sent to the Anthropic API, nothing else

---

## Phase 4: Workflow Improvements

After using the app on real searches, several things were changed.

### Update 1 — Stage 4: Universal outreach instead of per-candidate

**Original:** Stage 4 had three input fields — first name, current title, background detail — and generated a personalized message per candidate.

**Problem:** The outreach message doesn't actually change per person. You write one good message and send it to everyone on the list, swapping in the first name manually.

**Change:** Removed all input fields. One button. Generates a universal outreach template with `[First Name]` as a placeholder. Copy it, change the name, send.

### Update 2 — Stage 5: Auto-detect the gap instead of manual input

**Original:** Stage 5 required three manual fields — candidate name, what was relevant, what the gap was.

**Problem:** You already know what was relevant and what the gap is. Having to type it out defeats the purpose.

**Change:** Now you just paste the candidate's LinkedIn profile or background info into one box. Claude reads it against the stored JD, identifies what was relevant and what the specific gap is, and writes the clarification message automatically.

### Update 3 — Multi-role support

**Problem:** Working multiple roles at once meant the app only held one JD at a time. Switching between searches required re-pasting everything.

**Change:** Added a role switcher to the top of the sidebar. Each role has:
- A name (editable in Stage 1)
- Its own JD
- Its own saved outputs for all 7 stages

Roles are stored in `localStorage` so they persist across browser sessions. The dropdown in the sidebar shows all active roles with an `active` indicator and lets you create new ones or delete old ones.

### Update 4 — Refinement box on every stage

**Change:** After any output is generated, a "Refine this output" text box appears at the bottom of every stage. Type what's slightly off, hit Refine (or Cmd+Enter), and Claude rewrites the output in place — streaming the revision into the same textarea.

Works on every stage:
- Stages 1, 4, 5, 6, 7: refines the text output directly
- Stage 2: refines all 5 Boolean strings together, re-parses them back into individual fields
- Stage 3: refines the screened results table, re-parses rows back into the table

### Update 5 — Save all outputs per role

**Problem:** Generated outputs disappeared on page refresh.

**Change:** Every stage output is now saved to `localStorage` automatically (500ms debounce after any change). When you switch roles or refresh the page, all outputs come back exactly as you left them.

What's saved per role:
- Stage 1: the confirmation email text
- Stage 2: all 5 Boolean strings
- Stage 3: the full accumulated screening results (by batch)
- Stages 4–7: each generated text output

### Update 6 — Candidate screener batch dividers

**Problem:** When pasting multiple batches of candidates, all the results merged into one undifferentiated list and it was hard to tell where one batch ended and the next began.

**Change:** Each new batch gets its own visual section. Between batches there is a dark header row showing "Batch 2 — 12 candidates", "Batch 3 — 8 candidates" etc. Rows in alternating batches also get a subtle background shift (white / light gray) for added visual separation. The counter at the top shows total candidates across total batches.

---

## Phase 5: Visual Redesign

### Lawrence Harvey branding

After the app was functional, the UI was updated to match Lawrence Harvey's brand identity.

**Colors added to Tailwind config (`tailwind.config.js`):**

```js
lh: {
  50:  '#F2EEF9',
  100: '#E4DCF4',
  200: '#C9BAE9',
  300: '#AE97DE',
  400: '#9375D3',
  500: '#7B5CBF',   // primary brand purple
  600: '#6448A8',
  700: '#4E3690',
  800: '#362378',
  900: '#1E1040',   // sidebar mid
  950: '#0D0820',   // sidebar background
},
```

**Sidebar:**
- Background: deep navy-purple (`lh-950`)
- Logo: "lawrence" in lavender above "HARVEY" in bold white on white block — matches the brand image
- Stage numbers: monospace `01`–`07` format instead of plain digits
- Active stage: left purple border accent (`lh-500`)
- All stage labels: white

**API key gate:**
- Dark themed to match sidebar
- LH logo centered
- Monospace input styling

**Typography:**
- JetBrains Mono loaded for all monospace elements (stage numbers, labels, copy buttons, refinement headers)

**Main area:**
- Subtle dot-grid background texture behind the white content panels

**Buttons, focus rings, loading indicators:** All updated from default blue to LH purple throughout.

---

## Phase 6: Accessing the App

### Option A — StackBlitz (no install needed)

1. Go to **stackblitz.com**
2. Import from GitHub: `jayw33lh/rec-automation`, branch `claude/recruiting-workflow-app-VOclb`
3. When the app loads, it will show the API key screen — paste your Anthropic key and click Continue
4. The key is saved in `sessionStorage` for that tab

### Option B — Run locally (recommended for production use)

Requirements: Node.js (nodejs.org, LTS version) and Git.

```bash
git clone https://github.com/jayw33lh/rec-automation.git
cd rec-automation
git checkout claude/recruiting-workflow-app-VOclb
npm install
npm run dev
```

Open **http://localhost:5173** — the API key screen will appear on first load.

### Option C — No admin rights on your machine (Mac)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.zshrc
nvm install --lts
```

Then follow Option B above. `nvm` installs Node.js entirely in your home folder — no admin needed.

---

## Quick Reference: How Each Stage Works

| Stage | What you put in | What you get out |
|-------|-----------------|------------------|
| 1. Job Intake | Paste or upload a JD (PDF, DOCX, or text) | Filled confirmation email template |
| 2. Boolean Generator | Nothing — uses saved JD | 5 LinkedIn Recruiter Boolean strings |
| 3. Candidate Screener | Paste LinkedIn results (batch by batch) | YES / MAYBE / NO table with reasons, separated by batch |
| 4. Outreach | Nothing — uses saved JD | Universal outreach template with [First Name] placeholder |
| 5. Clarification | Paste candidate LinkedIn/background info | Pre-call gap message, auto-identifies what's relevant and what's off |
| 6. Candidate Writeup | Name, title, company, citizenship, comp, call notes | Exactly 6 bullets mapping background to role |
| 7. Interview Prep | Resume, JD (pre-filled), HM LinkedIn, format, optional intel | Long-form prep email — 6 sections |

---

## Key Decisions Explained

**Why Sonnet 4 and not Opus or Haiku?**
Haiku produces flat, generic output — especially bad for Stage 5 (needs to name a precise gap) and Stage 7 (synthesizing multiple inputs into a long coherent doc). Opus is slower and more expensive with no meaningful quality difference for this type of content generation. Sonnet hits the right balance of speed, quality, and cost for high-volume recruiting use.

**Why no backend?**
Everything runs in the browser. The Anthropic SDK supports browser use with `dangerouslyAllowBrowser: true`. The API key lives in sessionStorage and is only ever sent to Anthropic's API directly. For a personal tool used by one person, this is the right tradeoff — no server to maintain, no hosting cost, no deployment.

**Why localStorage for role persistence?**
Roles and all generated outputs survive browser refreshes without any account system or database. For a single-user tool, localStorage is the right fit — it's fast, simple, and completely private.

**Why pdfjs-dist instead of pdf-parse?**
`pdf-parse` is a Node.js library and cannot run in a browser. `pdfjs-dist` is the browser-native equivalent (it's actually what `pdf-parse` wraps under the hood). Functionally identical for this use case.

---

## The Anthropic API Cost

Costs come from your Anthropic account at console.anthropic.com. Claude Sonnet 4 is priced per token — for typical recruiting use (10-20 generations per search, multiple searches per week) you're looking at a few dollars a month at most. Add a credit card at console.anthropic.com and load credits; there's no subscription required.

---

*Built on Claude Code — claude.ai/code*
