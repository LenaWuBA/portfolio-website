# Lena Wu — Business Development & Analytics Portfolio

A personal portfolio website for a business development professional with 11 years of
enterprise B2B experience, currently pursuing an MS in Business Analytics at Santa Clara
University. Built for ISBA2438 Assignment 2.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Server Actions, Turbopack)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- ESLint 9

No other runtime dependencies. Project data lives in plain JavaScript/JSON files —
no database.

## Getting Started

Prerequisites: [Node.js](https://nodejs.org) (v20+ recommended) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run lint    # run ESLint
npm run build   # production build
npm start       # serve the production build
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page with hero, introduction, and links to all sections. |
| `/about-me` | Professional background, graduate studies, and skills. |
| `/projects` | Index of projects with summary cards. |
| `/projects/lead-scoring` | Project detail page, statically prerendered. |
| `/projects/ascend-dashboard` | Project detail page, statically prerendered. |
| `/contact-me-server-form` | Contact form backed by a Next.js Server Action. |
| any other URL | Custom 404 page (`src/app/not-found.js`). |

### Dynamic project routes

`src/app/projects/[slug]/page.js` is a dynamic route. It reads the `slug` URL
parameter (awaiting the `params` promise), looks the project up in the shared data
structure at `src/data/projects.js`, and renders its detail page. The two known slugs
are prerendered statically via `generateStaticParams`, and unknown slugs call
`notFound()` to render the 404 page. Adding a project to `src/data/projects.js`
automatically adds its card and detail page.

## Contact Form Flow (Server Action → JSON file)

1. The visitor submits Name, Email, and Message on `/contact-me-server-form`.
2. `src/components/ContactForm.js` (a Client Component) submits the form through
   React 19's `useActionState`, which posts the form data to the server without a
   page reload.
3. The form data is handled by the `submitContact` Server Action in
   `src/app/contact-me-server-form/actions.js` (marked server-only with
   `"use server"`).
4. The action validates the input on the server: trims whitespace, requires all
   three fields, enforces length limits (name ≤ 100, email ≤ 254, message ≤ 2000),
   and checks the email format.
5. Valid submissions are appended to `data/contact-submissions.json` using Node.js
   `fs/promises`: the file is created (with its `data/` directory) on first use, and
   each record stores a `crypto.randomUUID()` id, name, email, message, and an
   ISO-8601 `submittedAt` timestamp. Existing records are always preserved.
6. The action returns a plain object that `useActionState` uses to render a success
   banner, field-level validation errors, or a retry message on storage failure.

### Limitations

- **Local JSON storage is for coursework only.** On serverless hosting platforms
  such as Vercel the filesystem is ephemeral (and often read-only outside `/tmp`),
  so `data/contact-submissions.json` would not reliably persist. A production
  deployment should use a database or object storage.
- Writes are not atomic: simultaneous submissions could race (last write wins).
- There is no rate limiting, spam protection, CAPTCHA, or email verification.
- The email format check uses a deliberately simple pattern, not full RFC 5322
  validation.
- Submissions are private: the `data/` directory is excluded from Git via
  `.gitignore`, lives outside `public/` (never served as a static asset), and is
  never rendered by any route.

## Project Structure

```
src/
├── app/                     # App Router: file-based routing
│   ├── layout.js            # Root layout: navbar, footer, site metadata
│   ├── page.js              # Landing page (/)
│   ├── not-found.js         # Custom 404 page
│   ├── about-me/page.js     # About Me (/about-me)
│   ├── projects/page.js     # Projects index (/projects)
│   ├── projects/[slug]/     # Dynamic project detail (/projects/[slug])
│   └── contact-me-server-form/
│       ├── page.js          # Contact page
│       └── actions.js       # "use server" form action + JSON persistence
├── components/              # Navbar, Footer, ContactForm
└── data/projects.js         # Reusable project data structure
```

## Documentation

`PROMPT_LOG.md` records the prompts used to build this site and the development
decisions, tests, and reviews at each step.
