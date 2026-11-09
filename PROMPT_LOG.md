# PROMPT_LOG.md — Development Prompt & Decision Log

**Course:** ISBA2438 — Assignment 2 (Personal Portfolio Website)
**Project:** `portfolio-website`
**Started:** November 8, 2026

This file records the prompts used during development and the key decisions made,
as required by the assignment (prompt quality is part of the grade).

---

## Prompt 1 — Project Setup (November 8, 2026)

> I am working on Assignment 2 for my ISBA2438 course. I need to build a personal
> portfolio website using Next.js. Please help me set up a new project with the
> following instructions:
>
> 1. Create a new Next.js project named `portfolio-website` in
>    `C:\Users\yiwu9\Viber\ISBA2438\portfolio-website`.
> 2. Use the Next.js App Router, JavaScript, and Tailwind CSS.
> 3. Set up the project with a clean and professional structure.
> 4. Make sure the project can run locally using `npm run dev`.
> 5. Do not modify my existing `product-inventory-cli` project.
> 6. Do not implement all the website features yet. First, complete the project
>    setup and verify that the default Next.js homepage loads successfully.
> 7. Explain what files and folders you created and what each important file does.
> 8. Save a record of my prompts and the development decisions in a `PROMPT_LOG.md`
>    file because prompt quality is part of my assignment grade.
>
> Please proceed step by step and tell me when the initial setup is complete.

### Why this prompt was effective

- **Explicit scope:** Named the exact project name, target directory, and stack
  (Next.js App Router + JavaScript + Tailwind CSS), leaving no ambiguity.
- **Guardrails:** Explicitly protected the existing `product-inventory-cli`
  project from modification.
- **Incremental delivery:** Requested setup and verification first, deferring
  feature implementation to a later step — a good habit for large builds.
- **Verifiable acceptance criteria:** Required the site to run locally via
  `npm run dev` and the default homepage to load before proceeding.
- **Documentation requirement:** Asked for explanations of generated files and a
  persistent prompt log for grading.

---

## Development Decisions Log

### Decision 1 — Scaffold tool and options

- **What:** Created the project with `create-next-app@latest` using flags:
  `--js --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --yes`
- **Why:**
  - `--app` → uses the modern **App Router** (required by the assignment).
  - `--js` → **JavaScript** instead of TypeScript (per assignment instructions).
  - `--tailwind` → **Tailwind CSS v4** preconfigured for styling.
  - `--src-dir` → places application code under `src/`, separating source code
    from configuration files for a cleaner, more professional structure.
  - `--import-alias "@/*"` → enables clean absolute imports like
    `import Button from "@/components/Button"`.
  - `--eslint` → includes linting for code quality.
  - `--turbopack` → faster development server startup and hot reload.
- **Result:** Next.js 16.4.5, React 19.3.0, Tailwind CSS 4.x, ESLint 9.x.

### Decision 2 — Environment workaround (Windows PowerShell execution policy)

- **What:** The machine's PowerShell execution policy blocks `npm.ps1`/`npx.ps1`,
  so commands were run via `npm.cmd` / `npx.cmd`.
- **Why:** Required to execute npm on this system without weakening security
  policy globally.

### Decision 3 — Verification before feature work

- **What:** Started `npm run dev`, confirmed the server became **Ready in ~0.9s**
  on `http://localhost:3000`, then confirmed the default homepage returned
  **HTTP 200** with the expected "Create Next App" content. The dev server was
  then stopped to leave a clean state.
- **Why:** Verifying the baseline before adding features isolates any future
  errors to new code rather than the scaffold.

### Decision 4 — Scope control

- **What:** No portfolio features were implemented in this step; only the
  scaffold and its verification were completed, per instructions.
- **Why:** Establish a known-good baseline first; feature work comes next.

---

## Prompt 2 — Build the Main Portfolio Pages (November 8, 2026)

> The initial Next.js project setup is complete. Now let's build the main
> portfolio pages for Assignment 2. Please work inside the existing
> `portfolio-website` project. Do not create a new project.
>
> My portfolio should represent a professional with 11 years of enterprise B2B
> business development and key account management experience who is currently
> pursuing an MS in Business Analytics at Santa Clara University.
>
> Please implement the following:
>
> 1. Landing Page (`/`): professional hero with the headline "Connecting
>    Business Strategy with Data-Driven Insights", a brief introduction, and
>    buttons linking to About Me, Projects, and Contact Me.
> 2. About Me (`/about-me`): professional background, current MS studies,
>    skills (Business Development, Strategic Partnerships, Python, SQL,
>    Power BI, Tableau, Machine Learning). Professional, concise,
>    job-search-suitable content.
> 3. My Projects (`/projects`): two project cards — "Lead Scoring with Machine
>    Learning" and "Ascend NorCal Sponsor Dashboard" — each with a short
>    description and a link to its project detail page.
> 4. Dynamic Project Routes: shared dynamic route at
>    `src/app/projects/[slug]/page.js` supporting `/projects/lead-scoring` and
>    `/projects/ascend-dashboard`, a reusable data structure, slug-based
>    rendering, and a proper 404 for invalid slugs.
> 5. Navigation: consistent responsive navbar (Home, About Me, Projects,
>    Contact Me) for desktop and mobile.
> 6. Contact Me at `/contact-me-server-form`: basic form UI (Name, Email,
>    Message) with no server-side submission yet.
>
> Design requirements: modern, professional, clean design; Tailwind CSS;
> accessible labels, semantic HTML, responsive layouts; do not invent
> professional achievements or project metrics; do not add unnecessary
> dependencies.
>
> After implementation: verify all routes work, run ESLint and fix errors,
> explain how the dynamic routing works, update `PROMPT_LOG.md`, and summarize
> all modified files and remaining work. Do not push to GitHub yet.

### Why this prompt was effective

- **Context setting:** Defined the professional persona up front so all copy
  would be consistent and truthful.
- **Structured scope:** Six numbered requirements mapped cleanly to routes and
  components, leaving nothing ambiguous.
- **Explicit technical contract:** Specified the exact file path for the
  dynamic route, the two slugs, and the 404 requirement.
- **Ethical guardrails:** Prohibited invented achievements and metrics, which
  matters for a job-search portfolio.
- **Built-in verification loop:** Required route checks, linting, explanation,
  and documentation in the same request.
- **Release control:** Explicitly deferred GitHub push and server-side form
  handling.

---

## Development Decisions Log (Implementation Phase)

### Decision 5 — Single reusable project data source

- **What:** Created `src/data/projects.js` exporting a `projects` array (each
  entry: `slug`, `title`, `summary`, `technologies`, `overview` paragraphs,
  `highlights`) plus a `getProjectBySlug` helper.
- **Why:** Both `/projects` and the dynamic route import the same data, so
  adding a project is a one-file change; the detail page renders generically.

### Decision 6 — Shared layout with responsive navigation

- **What:** Root layout (`src/app/layout.js`) now renders a sticky `Navbar`
  component, a `<main id="main-content">` landmark, and a `Footer`. Site-wide
  metadata (title template, description) is defined in the layout; each page
  overrides with its own title.
- **Why:** One place for navigation/footer keeps every route consistent; the
  title template (`%s | Your Name`) gives clean per-page `<title>`s.

### Decision 7 — Client-side Navbar with active-link highlighting

- **What:** `src/components/Navbar.js` is a client component (`usePathname`)
  that highlights the active link and toggles a hamburger menu on mobile with
  proper `aria-expanded`, `aria-controls`, and `aria-current="page"`.
- **Why:** Active states and menu toggling need browser APIs; the rest of the
  site remains server-rendered. Accessible attributes keep it keyboard/screen-
  reader friendly.

### Decision 8 — Next.js 16 dynamic routing pattern

- **What:** `src/app/projects/[slug]/page.js` is an `async` server component
  that `await`s the `params` Promise, resolves the project via
  `getProjectBySlug`, calls `notFound()` for unknown slugs, and exports
  `generateStaticParams` (prerenders both slugs at build time) and
  `generateMetadata` (per-project page titles).
- **Why:** In Next.js 16, `params` is asynchronous and must be awaited;
  `generateStaticParams` means the two known projects are fully static pages,
  while unknown slugs render the 404 UI. This was confirmed against the
  version's bundled documentation before coding.

### Decision 9 — 404 handling

- **What:** Added `src/app/not-found.js` with a custom 404 UI (Return Home /
  View Projects links). Invalid project slugs reach it via `notFound()`, as do
  any unmatched URLs.
- **Why:** Next.js renders the nearest `not-found.js` when `notFound()` is
  thrown; a root-level file covers both dynamic-route misses and unknown URLs.

### Decision 10 — Accessible contact form UI (no backend)

- **What:** `/contact-me-server-form` renders semantic `<form>` markup with
  `htmlFor`/`id`-linked labels, `autoComplete` hints, `required` validation,
  and a visible note that submission handling is coming later. No `action` is
  wired yet.
- **Why:** The form UI is reviewable in the browser now; a Next.js Server
  Action can be attached later without redesigning the markup.

### Decision 11 — Build-time fix: no `new Date()` in prerendered footer

- **What:** The first production build failed because `new Date().getFullYear()`
  in the footer is an unstable value under Cache Components (Next.js 16 blocks
  time-dependent rendering during prerender). Replaced with the literal year.
- **Why:** A static portfolio does not need a client-computed year; hardcoding
  keeps the footer fully static and the build green. (Trade-off: update the
  year manually in January, or revisit with a client component.)

### Decision 12 — Content conservatism

- **What:** All copy (hero, about, project pages) is limited to facts supplied
  in the prompt: 11 years enterprise B2B business development and key account
  management, MS in Business Analytics at Santa Clara University, the named
  skill list, and the two project names. Project descriptions describe purpose
  and process only — no metrics, employers, or achievements were invented.
- **Why:** Per the assignment guardrail; also keeps the site truthful for
  recruiters. Project detail copy in `src/data/projects.js` should be
  reviewed and personalized by the site owner.

### Verification results (implementation phase)

- Routes: `/`, `/about-me`, `/projects`, `/projects/lead-scoring`,
  `/projects/ascend-dashboard`, `/contact-me-server-form` → all **200**.
- `/projects/nonexistent-slug` and unmatched URLs → **404** with the custom
  not-found UI.
- `npm run lint` → passes with no errors or warnings.
- `npm run build` → succeeds; both project pages prerender statically.

---

## Prompt 3 — Server-Side Contact Form with JSON Storage (November 8, 2026)

> Now implement the server-side contact form functionality for Assignment 2 in
> the existing `portfolio-website` project. The assignment explicitly requires
> all contact form submissions to be saved in a JSON file, and I must explain
> the complete flow in a HackerSquad video.
>
> Requirements:
>
> 1. Use a Next.js Server Action for the form at `/contact-me-server-form`.
> 2. Collect Name, Email, and Message.
> 3. Validate all three fields on the server: all fields required; validate
>    email format; trim whitespace; apply reasonable input length limits.
> 4. Save each valid submission to a local JSON file at
>    `data/contact-submissions.json`.
> 5. Store submissions as an array. Each submission should include a unique
>    ID, name, email, message, and timestamp.
> 6. Preserve previous submissions when a new submission is added.
> 7. Create the data directory and JSON file automatically if needed.
> 8. Display a clear success message after submission and useful error
>    messages for invalid inputs or storage failures.
> 9. Do not expose the saved submissions publicly or include them in the
>    GitHub repository. Update `.gitignore` accordingly.
> 10. Keep the implementation simple and easy for a beginner to explain. Do
>     not use a database or external form service.
> 11. Ensure that file-writing logic runs only on the server, using Node.js
>     filesystem APIs.
> 12. Handle file read/write errors carefully and avoid silently losing
>     existing submissions.
> 13. Explain that local JSON storage is intended for this coursework and is
>     not reliable persistent storage on many serverless hosting platforms.
>
> Testing: valid submission; missing required fields; invalid email; two
> consecutive valid submissions (both records must remain); lint and
> production build; review the generated code for security, validation, and
> data persistence issues.
>
> Documentation: update `PROMPT_LOG.md` with the complete prompt, design
> decisions, test results, and code review findings; explain the full data
> flow from the browser form to the Server Action and JSON file; list the
> exact files changed. Do not push to GitHub yet. Do not modify the previous
> Python CLI project.

### Why this prompt was effective

- **Grounded in the assignment rubric:** Named the exact deliverable (JSON file
  storage) and the demo format (video walkthrough), so the implementation
  stayed explainable rather than clever.
- **Explicit contract:** Specified the file path, record shape (unique ID,
  name, email, message, timestamp), and append semantics (never lose prior
  submissions).
- **Safety requirements built in:** Server-only file access, no public
  exposure of submissions, `.gitignore` update, careful error handling for a
  corrupt data file.
- **Test plan supplied up front:** The six test scenarios were defined before
  implementation, so testing verified the contract rather than whatever
  happened to get built.
- **Honest scoping:** Acknowledged the storage approach is coursework-only and
  asked for that caveat to be documented.

---

## Development Decisions Log (Contact Form Phase)

### Decision 13 — Server Action in a dedicated `"use server"` file

- **What:** Created `src/app/contact-me-server-form/actions.js` containing
  `submitContact(previousState, formData)`, colocated with the contact route.
  The page (`page.js`, a Server Component) renders a new `ContactForm` client
  component; all Node.js filesystem code lives only in the action file.
- **Why:** The `"use server"` directive guarantees this module never ships in
  client JavaScript. Colocating it with the route keeps the beginner-friendly
  story simple: page → form component → action → JSON file. No dependencies
  were added (Node's `fs`, `path`, and `crypto.randomUUID` cover everything).

### Decision 14 — `useActionState` for success and error UI

- **What:** `src/components/ContactForm.js` is a Client Component using
  React 19's `useActionState(submitContact, initialState)`. The action returns
  a plain serializable object: `{ status: "idle" | "success" | "error",
  message, errors }`. Field errors render under each input (with
  `aria-invalid` + `aria-describedby`), a success banner uses `role="status"`,
  and general errors use `role="alert"`. `isPending` disables the button and
  shows "Sending..." during the round trip.
- **Why:** This is the pattern the Next.js 16 forms documentation recommends.
  Native HTML validation (`required`, `type="email"`) is kept for instant
  feedback, while the server remains the single source of truth and re-validates
  everything. No `maxLength` attributes are set so the server-side length
  limit is demonstrable in the browser.

### Decision 15 — Server-side validation rules

- **What:** Values are read from `FormData` and converted with `String(...)`;
  all three fields are trimmed. Required checks run first, then length limits
  (name ≤ 100, email ≤ 254, message ≤ 2000 characters), then email format via
  `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (intentionally simple: "something@something
  with a dot", easy to explain, rejects the common malformed cases).
- **Why:** Trimming prevents whitespace-only submissions sneaking past the
  required check. The simple regex avoids an unexplainable RFC-compliant
  monster; the browser's native email check plus this covers the coursework
  needs without a validation library.

### Decision 16 — Append-only JSON persistence with corrupt-file protection

- **What:** `saveSubmission` creates `data/` with `fs.mkdir(..., { recursive:
  true })` if missing, reads `contact-submissions.json` (empty array if the
  file does not exist), pushes `{ id, name, email, message, submittedAt }`,
  and writes pretty-printed JSON back. If the file exists but cannot be read,
  is corrupt, or is not an array, the action returns a storage-failure message
  and never overwrites the file.
- **Why:** Read → modify → write preserves all previous submissions
  (requirement 6). Failing loudly instead of overwriting protects against
  silently destroying a growing submission history (requirement 12). The ID
  comes from `crypto.randomUUID()`; the timestamp is `new Date().toISOString()`
  captured at submission time on the server.

### Decision 17 — Privacy: submissions stay local and out of git

- **What:** The data file lives at the project root (not in `public/`, so it is
  never served as a static asset) and `/data` was added to `.gitignore`.
  No page or route reads or displays submissions.
- **Why:** Submissions contain personal contact details from real people;
  exposing or committing them would be a privacy failure (requirement 9).

---

## Full Data Flow (for the video walkthrough)

1. **Browser:** Visitor fills in Name / Email / Message on
   `/contact-me-server-form` and clicks "Send Message".
2. **Client Component:** `ContactForm` is a `"use client"` component. Its
   `<form action={formAction}>` is wired through React's `useActionState`
   hook, so submitting posts the `FormData` to the server in the background —
   no page reload, no custom API route, no `fetch` code.
3. **Server Action:** Next.js routes the POST to the `submitContact` function
   in `src/app/contact-me-server-form/actions.js` (the file's top-level
   `"use server"` directive marks every export as a server-only endpoint).
4. **Validation (server):** The action trims the values, checks required,
   length limits, and email format, and returns
   `{ status: "error", message, errors }` if anything fails — no file is
   touched.
5. **Persistence (server only):** On valid input, the action uses Node.js
   `fs/promises` to create the `data/` directory if needed, read the existing
   array from `data/contact-submissions.json`, append a new record
   (`id` from `crypto.randomUUID()`, plus `submittedAt` ISO timestamp), and
   write the file back.
6. **Response:** The action returns a success object to `useActionState`,
   which re-renders `ContactForm` with a green confirmation banner and resets
   the form fields. Storage failures show a retry message instead.
7. **Scope note:** React re-renders only the form component; the rest of the
   statically rendered page is untouched.

**Serverless caveat (requirement 13):** This local JSON storage is intentional
coursework-only storage. On serverless hosting platforms such as Vercel, the
filesystem is ephemeral (and often read-only outside `/tmp`), so
`data/contact-submissions.json` may not persist between deployments or
requests. Real deployments would use a database or object storage; for this
assignment the local file keeps the flow simple and inspectable.

---

## Test Results (Contact Form Phase)

All tests were run by invoking the Server Action directly with constructed
`FormData` objects (exercising the exact validation and persistence code the
browser triggers), from the project root so `process.cwd()` resolves the same
as the dev server:

| # | Scenario | Result |
|---|---|---|
| T1 | Valid submission with extra whitespace | PASS — success; 1 record saved; values trimmed; `id` + `submittedAt` present; record has exactly the 5 required fields |
| T2 | All required fields empty | PASS — error returned with all three field messages; file unchanged |
| T3 | Invalid email format | PASS — email-only error; file unchanged |
| T4 | Two consecutive valid submissions | PASS — file holds 3 records total; both new records plus the original preserved; all IDs unique |
| T5 | Message over 2000 characters | PASS — length error returned; file unchanged |
| T6 | Corrupt JSON file | PASS — storage error returned; corrupt file left untouched (not overwritten or deleted) |
| T7 | Valid JSON but not an array | PASS — storage error returned; file left untouched |
| — | `/contact-me-server-form` renders with form | PASS — HTTP 200 with form markup |
| — | `npm run lint` | PASS — no errors or warnings |
| — | `npm run build` | PASS — all routes compile; contact page prerenders statically |

Test records were cleaned up afterwards; `data/` is regenerated automatically
on the first real submission (requirement 7).

## Code Review Findings (Contact Form Phase)

Reviewed for security, validation, and data persistence:

- **Server-only file access:** All `fs`/`path`/`crypto` imports live in the
  `"use server"` module, which Next.js excludes from client bundles. The
  browser only ever sees the form and the serializable result object.
- **No public exposure:** The data file sits outside `public/`, is gitignored,
  and no route renders submissions. A visitor can only write, never read.
- **XSS safety:** Stored values are only ever re-rendered through React's
  escaping (currently not rendered at all), so script injection through the
  form cannot execute.
- **Input hardening:** Trim + required checks + per-field length caps bound
  every write; the email regex rejects malformed addresses.
- **Error transparency:** Validation failures identify the offending field;
  storage failures show a generic retry message without leaking filesystem
  details to the client.
- **Known limitations (acceptable for coursework, worth stating in the
  video):**
  - Read-modify-write is not atomic; two simultaneous submissions could race
    (last write wins). A production system would use a database with
    transactions or file locking.
  - No rate limiting, spam protection, or email verification — the endpoint
    could be spammed in a real deployment.
  - The email regex is intentionally simple, not fully RFC-compliant.
  - As documented above, the local JSON file is not durable storage on
    serverless platforms.

---

## Next Steps (planned)

- ~~Update `src/app/layout.js` metadata (site title/description).~~ Done.
- ~~Replace the default homepage in `src/app/page.js` with a hero/intro
  section.~~ Done.
- ~~Add About, Projects, and Contact routes with responsive navigation.~~ Done.
- ~~Server-side contact form submission to local JSON storage.~~ Done.
- ~~Replace the "Your Name" placeholder (navbar brand, footer, metadata) with
  the site owner's real name.~~ Done — "Lena Wu".
- Review and personalize the project copy in `src/data/projects.js` (describing
  actual tools and process used).
- Consider adding a resume/CV download and LinkedIn/GitHub links.
- Deploy (push to GitHub and hosting) once reviewed — deferred by instruction.

---

## Prompt 4 — Final Personalization & Quality Review (November 8, 2026)

> The contact form has now been manually tested successfully. I submitted a
> test message through the browser and verified that the submission was saved
> in `data/contact-submissions.json` with a UUID and timestamp.
>
> Please perform the final personalization and quality review of my existing
> Next.js portfolio website.
>
> 1. Replace all user-facing "Your Name" placeholders with "Lena Wu",
>    including the navbar, footer, and metadata.
> 2. Review all four main pages and both dynamic project detail routes
>    (`/`, `/about-me`, `/projects`, `/projects/lead-scoring`,
>    `/projects/ascend-dashboard`, `/contact-me-server-form`).
> 3. Ensure my professional information is accurate: 11 years of enterprise
>    B2B business development and account management experience; currently
>    pursuing an MS in Business Analytics at Santa Clara University; skills
>    in Python, SQL, Power BI, Tableau, and machine learning; experience in
>    strategic partnerships, enterprise account management, and data-driven
>    business decisions.
> 4. Review the project descriptions for clarity and accuracy. Do not invent
>    achievements, metrics, certifications, or responsibilities.
> 5. Review the Server Action and contact form code for correctness,
>    validation, error handling, and JSON persistence.
> 6. Verify that the JSON submission file is excluded from Git through
>    `.gitignore`. Do not delete my local test submission.
> 7. Test all six routes, including an invalid project slug that should
>    display a 404 page.
> 8. Run ESLint and a production build. Fix any errors found.
> 9. Update `PROMPT_LOG.md` with this complete prompt, test results, code
>    review findings, and any fixes.
> 10. Summarize what was changed and identify any remaining issues.
>
> Do not create a new project, do not modify my previous Python CLI project,
> and do not push to GitHub yet.

### Why this prompt was effective

- **Closed the loop on manual testing:** Reported the real browser test result
  before asking for review, so the reviewer knew the runtime behavior was
  verified by a human.
- **Review with a checklist:** Six named routes, an accuracy checklist for the
  professional persona, and explicit "do not invent" guardrails made the
  content audit objective.
- **Protected state:** Explicitly said to preserve the local test submission
  and keep the data file out of Git — avoiding a common cleanup mistake.
- **Clear finishing instructions:** Lint + build + documentation + summary,
  with release still deferred.

---

## Final Review Results (Personalization Phase)

### Personalization changes

- `src/components/Navbar.js` — brand link now reads "Lena Wu".
- `src/components/Footer.js` — copyright now reads "© 2026 Lena Wu".
- `src/app/layout.js` — metadata default title is now
  "Lena Wu | Business Development & Analytics Portfolio" and the title
  template is "%s | Lena Wu" (so subpages render e.g. "About Me | Lena Wu").
- Verified in served HTML: navbar, footer, and both `<title>` examples render
  the new name. No other "Your Name" occurrences remain in `src/`.

### Content accuracy audit (all six routes)

- `/` — headline exact; intro states 11 years enterprise B2B, strategic
  partnerships, key account management, MS BA at Santa Clara University; the
  three CTA buttons link to the correct routes; skills strip matches the
  approved skill list exactly.
- `/about-me` — 11 years enterprise B2B business development and key account
  management; MS in Business Analytics at Santa Clara University; skill groups
  limited to the stated skills (Business Development, Strategic Partnerships,
  Key Account Management, Python, SQL, Power BI, Tableau, Machine Learning);
  career focus ties data to business decisions. No employers, job titles,
  metrics, dates, or certifications were invented.
- `/projects` + both detail routes — descriptions are process-focused only
  (problem → approach → output); no outcomes, metrics, or role claims. The
  `technologies` tags stay within the stated skill set ("Data Visualization"
  and "Dashboard Design" are used for the Ascend dashboard rather than
  guessing a specific BI tool).
- `/contact-me-server-form` — form behavior unchanged from the tested
  implementation.

### Server Action & form code review

- Validation: trim → required → length caps (100/254/2000) → email pattern;
  field-level errors returned to the UI; no file writes on invalid input.
- Persistence: `mkdir` recursive before write; read → append → write preserves
  all earlier records; ENOENT treated as empty array; corrupt or non-array
  JSON raises a storage error and leaves the file untouched (no data loss).
- Server-only: filesystem code confined to the `"use server"` module (Node
  built-ins only); no submissions rendered by any route.
- No issues found requiring code changes in this phase.

### Git & data checks

- `.gitignore` contains `/data` (line 40) — `data/contact-submissions.json`
  will not be committed.
- Local test submission preserved: file still holds exactly 1 record with
  `id` and `submittedAt`, verified before and after the production build.

### Route tests (final)

| Route | Result |
|---|---|
| `/` | 200 |
| `/about-me` | 200 |
| `/projects` | 200 |
| `/projects/lead-scoring` | 200 |
| `/projects/ascend-dashboard` | 200 |
| `/contact-me-server-form` | 200 |
| `/projects/not-a-real-project` | 404 (custom not-found page) |

### Tooling results (final)

- `npm run lint` — passes, no errors or warnings.
- `npm run build` — succeeds; all routes compile; both project detail pages
  prerender statically.
- No errors needed fixing in this phase; the only change was personalization.

### Remaining issues / known limitations (documented, not blocking)

- Project detail copy in `src/data/projects.js` should get a final read by
  Lena to confirm the summaries match what she actually did (especially the
  Ascend dashboard's tooling — deliberately left tool-agnostic).
- Footer year is hardcoded to 2026 (Next.js 16 Cache Components blocks
  `new Date()` in prerendered components); update manually or move to a client
  component later.
- Coursework-level limitations stand as reviewed in the contact-form phase:
  non-atomic read-modify-write on the JSON file, no spam/rate limiting,
  simple email regex, and local JSON not being durable on serverless hosts.
