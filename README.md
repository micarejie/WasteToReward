# IT Student Portfolio

A responsive portfolio for an information technology student. It is built with Next.js, React, TypeScript, and Tailwind CSS, and it stores profile, projects, journal posts, certificates, and contact messages in Supabase.

The public site includes Home, Projects, About, Blog, Certificates, and Contact. Administrators sign in with Supabase Auth and manage that content from a protected dashboard. Row Level Security decides who can read or change each table. A signed-in user is not an administrator unless their user id is in the `admins` table.

## What you should customize

The sample content is a starting point, not a finished biography.

- Name, headline, bio, email, location, and photo live in the profile row. Edit them at `/admin/profile`.
- The sample email is `hello@example.com`. Replace it with an address you actually use.
- The GitHub link points at [github.com/micarejie](https://github.com/micarejie). The LinkedIn link is a placeholder. Replace both.
- Education says “Add your college or university.” Put in your real school, year, and subjects.
- Skill levels are an honest student self-assessment. Change them only if they match your own experience.
- Two certificate rows are labeled as samples and are not featured. Delete them and add certificates you actually earned. Do not keep placeholder credentials.
- The resume at `public/resume.pdf` is a sample. Replace the file, or upload a PDF from the profile editor once Supabase Storage is connected.
- The portrait at `public/images/profile.jpg` is a generated stand-in. Replace it with your own photo.

## Prerequisites

- Node.js 20 or newer
- npm
- A [Supabase](https://supabase.com) project for persistent data, authentication, and file storage

Local development can run without Supabase. In that mode the site reads sample content and writes changes to `.data/demo-store.json` on your machine. That preview is for development only. Production should use Supabase.

## Installation

```bash
git clone <your-repository-url>
cd <project-folder>
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` before you expect the live database to work. Variable names are listed below. Do not commit real keys.

## Environment variables

| Variable | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server. Project URL from Supabase → Project Settings → API. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser and server. Preferred public key on newer projects. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server. Used when the project still shows an anon key. Either public key is enough. |
| `SUPABASE_SERVICE_ROLE_KEY` | `scripts/create-admin.mjs` only. Never prefix it with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph, and password-reset links. Example: `http://localhost:3000`. |
| `ADMIN_EMAIL` | First administrator, used only by the setup script. |
| `ADMIN_PASSWORD` | First administrator password, at least 8 characters. Used only by the setup script. |
| `ALLOW_DEMO_MODE` | Set to `true` only if you intentionally want the local preview in production. |
| `DEMO_ADMIN_EMAIL` | Optional preview login email. Defaults to `admin@localhost`. |
| `DEMO_ADMIN_PASSWORD` | Required for a production preview. At least 12 characters, and not the development default. |
| `DISABLE_DEMO_MODE` | Set to `true` to turn the local preview off even during `npm run dev`. |

When both the Supabase URL and a public key are set, the local preview turns off and the app uses Supabase.

## Create the Supabase project

1. Create a project in the Supabase dashboard.
2. Open **Project Settings → API** and copy the project URL and the publishable or anon key into `.env.local`.
3. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY`. Keep that key on the server and in your local shell. It is not used by the website itself.

## Run the database migration

Open the Supabase **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql`, and run it once.

The migration creates:

- `profiles`, `projects`, `blog_posts`, `certificates`, and `messages`
- `admins`, plus `is_admin()` so only listed users can change content
- Row Level Security policies for public reads, contact inserts, and administrator writes
- Storage buckets: `avatars`, `projects`, `blog`, `certificates`, and `resumes`
- Storage policies so anyone can read those public files, and only an administrator can upload, replace, or delete them

The resume bucket is public because the site offers the file as a download. Do not store private documents in these buckets.

If you use the Supabase CLI instead of the SQL editor, link the project and apply the migration from `supabase/migrations/`. The SQL file is written to run once. Running the storage policies a second time will fail because those policy names already exist. The seed file below is safe to run again.

## Seed sample content

In the SQL Editor, run `supabase/seed.sql` after the migration.

- The profile row is inserted only when `profiles` is empty.
- Projects, posts, and certificates use fixed ids and can be re-run.
- Certificate rows are layout placeholders. Replace or delete them.

You can also skip the seed and enter everything from the dashboard after you create an administrator.

## Create the first administrator

There is no public registration page. Create the account with the service-role script after the migration has run:

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export ADMIN_EMAIL="you@example.com"
export ADMIN_PASSWORD="a-long-unique-password"
node scripts/create-admin.mjs
```

The script confirms the email, creates the Auth user, and inserts that user id into `admins`. Signing in is not enough: a user who is missing from `admins` is signed out and cannot open the dashboard.

In the Supabase dashboard, set **Authentication → URL configuration**:

- Site URL: your `NEXT_PUBLIC_SITE_URL`
- Redirect URLs: `http://localhost:3000/auth/callback` and the same path on your production domain

Password reset emails use `/auth/callback?next=/admin/update-password`.

## Local preview without Supabase

`npm run dev` uses the sample content when Supabase is not configured. Sign in at `/admin/login` with:

- Email: `admin@localhost`
- Password: `preview-only`

Change those with `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD` if you want. Preview edits are stored in `.data/demo-store.json`. Uploaded files are written under `public/uploads/`. Both paths are gitignored.

The preview password is shown on the login page only while the preview is active. Production does not enable the preview unless `ALLOW_DEMO_MODE=true` and `DEMO_ADMIN_PASSWORD` is at least 12 characters and is not `preview-only`.

## Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Public routes:

- `/` home
- `/projects` and `/projects/[slug]`
- `/about`
- `/blog` and `/blog/[slug]`
- `/certificates`
- `/contact`

Admin routes:

- `/admin/login`
- `/admin` overview
- `/admin/projects`, `/admin/blog`, `/admin/certificates`, `/admin/messages`, `/admin/profile`

## Production build

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to the public origin before building so metadata and the sitemap use the right address. Set the Supabase variables in the host’s environment. Do not set `ALLOW_DEMO_MODE` on a public deployment unless you fully understand that it bypasses Supabase.

## Deploy

The app is a standard Next.js App Router project.

1. Push the repository to GitHub.
2. Import it in Vercel, Netlify, or another host that supports Next.js server features. Server Actions, the auth callback, and the password-reset route need a Node server. A purely static export will not run the dashboard or the contact form.
3. Add the environment variables from `.env.local.example`. Leave `SUPABASE_SERVICE_ROLE_KEY` off the hosting project unless you run the admin script there, which you should not need to do.
4. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin, including `https://`.
5. Add that origin’s `/auth/callback` URL to the Supabase redirect allow list.
6. Deploy, then sign in at `/admin/login` and replace the sample content.

## Storage uploads

From the dashboard, image and PDF fields upload into the matching bucket:

| Bucket | Used for | Allowed types | Size limit |
| --- | --- | --- | --- |
| `avatars` | Profile photo | JPEG, PNG, WebP, GIF | 5 MB |
| `projects` | Thumbnails and galleries | JPEG, PNG, WebP, GIF | 5 MB |
| `blog` | Cover images | JPEG, PNG, WebP, GIF | 5 MB |
| `certificates` | Certificate images or PDFs | JPEG, PNG, WebP, GIF, PDF | 8 MB |
| `resumes` | Resume PDF | PDF | 8 MB |

The saved public URL is written onto the database row. In local preview, the same checks apply and the file is stored under `public/uploads/<bucket>/`.

## Security notes

- Row Level Security is enabled and forced on every portfolio table.
- Anonymous visitors can read the profile, published projects, published posts, and certificates. They can insert a contact message only when `is_read` is false and the length checks pass. They cannot read messages.
- Administrator writes require `is_admin()`, which is true only for rows in `admins`.
- The service-role key is not imported by the Next.js app.
- The contact form validates on the server, ignores a hidden honeypot field, rejects submissions that arrive too quickly, and rate-limits repeated posts from the same address.
- Blog content is stored as Markdown and rendered without raw HTML.

## Troubleshooting

**The homepage says to connect the database.**  
Supabase variables are missing and the local preview is off. In development, leave the Supabase variables empty. In production, set the URL and public key, run the migration, and seed or create a profile.

**Sign-in says the account is not an administrator.**  
The Auth user exists, but `admins` has no row for that user id. Run `scripts/create-admin.mjs`, or insert the user id yourself with the SQL editor using the service role. Do not add an insert policy that lets users add themselves.

**Password reset never arrives.**  
Confirm the site URL and `/auth/callback` redirect in Supabase Auth. The local preview cannot send reset email.

**Uploads fail.**  
Confirm the migration created the buckets and storage policies, and that you are signed in as an administrator. Check the file type and size against the table above.

**Changes in the dashboard do not show on the public site.**  
Confirm the project or post is marked published. Featured homepage items also need the featured flag. Refresh the page; public reads are not cached across requests.

**The migration fails partway through.**  
Run it on an empty project. If policies already exist, drop the conflicting policies or use a fresh database before running the file again.

**`npm run build` fails on missing environment variables.**  
The build can complete without Supabase. If a host injects empty strings instead of omitting the variables, remove the empty values or set real ones. An empty URL together with a key is treated as not configured.

## Project layout

```text
app/                 routes, including public pages and /admin
components/          shared interface and dashboard forms
lib/supabase/        browser client, server client, and session refresh
lib/actions/         server actions for auth, contact, content, and uploads
lib/data/            database and local-preview reads and writes
lib/demo/            development preview store
supabase/migrations  schema, policies, and storage
supabase/seed.sql    replaceable sample content
scripts/             administrator setup and sample asset generators
public/              portrait, illustrations, and the sample resume
```

Regenerate `supabase/seed.sql` from the sample objects with:

```bash
node --experimental-strip-types scripts/generate-seed.mts
```

Regenerate the illustration SVGs and sample resume with:

```bash
node scripts/write-assets.mjs
```
