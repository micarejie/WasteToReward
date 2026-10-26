-- Sample portfolio content.
-- Safe to run more than once. The profile row is inserted only when the table is empty.
-- Project, article, and certificate rows use fixed sample ids.
-- Replace this content with your own work. The certificate rows are layout placeholders, not credentials.


insert into public.profiles (
  id, full_name, headline, tagline, motto, bio, email, avatar_url, resume_url,
  github_url, linkedin_url, location, interests, strengths, career_goals, skills, education, created_at, updated_at
)
select
  '11111111-1111-4111-8111-111111111111'::uuid,
  'Mica Dames',
  'IT Student & Aspiring Developer',
  'Building meaningful digital experiences through technology.',
  'Better code. Brighter future.',
  'I build simple and functional web applications, turning ideas into real solutions. I''m currently exploring web development, databases, and UI/UX design while pursuing my degree in Information Technology.',
  'hello@example.com',
  '/images/profile.jpg',
  '/resume.pdf',
  'https://github.com/micarejie',
  'https://www.linkedin.com/',
  'Philippines',
  array['Web Development', 'Databases', 'UI/UX Design', 'Tech and Gadgets'],
  array['I break a feature into small pieces before I start coding.', 'I pay attention to contrast, spacing, and keyboard access.', 'I keep notes on what I learn so the next project is easier.'],
  'I am looking for an internship where I can help build real web applications, practice databases and interface design, and grow into a dependable junior developer.',
  '[{"name":"HTML","category":"Frontend Development","level":"Comfortable"},{"name":"CSS","category":"Frontend Development","level":"Comfortable"},{"name":"JavaScript","category":"Frontend Development","level":"Comfortable"},{"name":"Tailwind CSS","category":"Frontend Development","level":"Learning"},{"name":"React","category":"Frontend Development","level":"Learning"},{"name":"Next.js","category":"Frontend Development","level":"Learning"},{"name":"PHP","category":"Backend Development","level":"Familiar"},{"name":"PostgreSQL","category":"Database Management","level":"Learning"},{"name":"Supabase","category":"Database Management","level":"Learning"},{"name":"JavaScript","category":"Programming Languages","level":"Comfortable"},{"name":"PHP","category":"Programming Languages","level":"Familiar"},{"name":"SQL","category":"Programming Languages","level":"Learning"},{"name":"Figma","category":"UI/UX Design","level":"Familiar"},{"name":"Git and GitHub","category":"Development Tools","level":"Comfortable"},{"name":"Visual Studio Code","category":"Development Tools","level":"Comfortable"}]'::jsonb,
  '[{"school":"Add your college or university","credential":"Bachelor of Science in Information Technology","period":"In progress","location":"Philippines","details":"Coursework and personal practice in web development, databases, and software fundamentals. Replace this entry with your school, year level, and subjects.","status":"In progress"}]'::jsonb,
  '2026-01-15T00:00:00.000Z'::timestamptz,
  '2026-04-18T02:00:00.000Z'::timestamptz
where not exists (select 1 from public.profiles);


insert into public.projects (
  id, title, slug, description, content, category, status, tech_stack, image_url, gallery,
  demo_url, github_url, featured, published, created_at, updated_at
) values (
  '22222222-2222-4222-8222-222222222221'::uuid,
  'Waste-to-Reward',
  'waste-to-reward',
  'A web system that encourages proper waste segregation and rewards users with points.',
  '{"overview":"Waste-to-Reward is a sample student project about making waste segregation easier to understand. The idea is a small web app where a household or campus group can log sorted waste and see points for consistent habits.","problem":"Sorting waste is easy to postpone when the rules feel unclear and there is no visible record of doing it correctly. A simple tracker can make the habit easier to follow.","objectives":["Explain the main waste categories in plain language.","Let a user record a sorting activity.","Show points as feedback, not as a made-up public ranking."],"target_users":"Students and households who want a straightforward way to practice waste segregation.","features":["Category guide for common waste types","A simple log for sorting activities","A points summary for the signed-in user","A clean layout that works on a phone"],"process":"I started with the user flow: learn the categories, record one action, and see the updated points. The interface uses a small set of cards so the first screen stays quiet. The data model keeps users, categories, and activity logs separate.","challenges":[{"challenge":"A points system can become the focus instead of the habit.","solution":"Points stay private to the user and only reflect their own log. The project does not invent community rankings."},{"challenge":"The category rules are not the same in every city.","solution":"The guide is written as editable content so it can be corrected for a real local policy later."}],"lessons":["A narrow first version is easier to explain than a marketplace of rewards.","Naming the tables clearly saved time once the forms were connected."]}'::jsonb,
  'Web Application',
  'In progress',
  array['Next.js', 'PostgreSQL', 'Tailwind CSS'],
  '/images/projects/waste-to-reward.svg',
  '[{"url":"/images/projects/waste-to-reward.svg","alt":"Illustrated preview of the Waste-to-Reward dashboard"}]'::jsonb,
  null,
  'https://github.com/micarejie/WasteToReward',
  true,
  true,
  '2026-02-02T00:00:00.000Z'::timestamptz,
  '2026-04-18T02:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  content = excluded.content,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  image_url = excluded.image_url,
  gallery = excluded.gallery,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  featured = excluded.featured,
  published = excluded.published,
  updated_at = excluded.updated_at;

insert into public.projects (
  id, title, slug, description, content, category, status, tech_stack, image_url, gallery,
  demo_url, github_url, featured, published, created_at, updated_at
) values (
  '22222222-2222-4222-8222-222222222222'::uuid,
  'FoodLink',
  'foodlink',
  'A food ordering and delivery platform for local restaurants, planned as a capstone project.',
  '{"overview":"FoodLink is the working name of my capstone concept: a modest ordering site for local restaurants. Guests browse a short menu, place an order, and the restaurant sees the order in a simple queue.","problem":"Small restaurants often take orders through chat messages. Details get lost, and the customer cannot see a clear menu or order status.","objectives":["Show a readable menu with prices.","Accept an order with contact details and notes.","Give the restaurant one list of new orders."],"target_users":"Local restaurant staff and customers who want a direct ordering page without a large delivery marketplace.","features":["Menu cards with name, price, and a short note","An order form with validation","Order status: received, preparing, ready","A staff view protected by authentication"],"process":"I mapped the guest path and the staff path before choosing tables. Supabase fits the project because authentication, the database, and row level security can live in one place. The public menu is readable by anyone. Orders are readable only by an administrator.","challenges":[{"challenge":"Delivery tracking, payments, and rider assignment made the scope too large.","solution":"The first version stops at placing an order and updating its status. Payments can be added later if the basic flow is solid."},{"challenge":"A public form will receive messy input.","solution":"The server checks required fields, email shape, and message length before anything is stored."}],"lessons":["Writing the security rule in a sentence first made the database policy easier to draft.","A capstone is easier to defend when every feature maps to a user task."]}'::jsonb,
  'Capstone',
  'In progress',
  array['Next.js', 'Supabase', 'Tailwind CSS'],
  '/images/projects/foodlink.svg',
  '[{"url":"/images/projects/foodlink.svg","alt":"Illustrated preview of the FoodLink ordering screen"}]'::jsonb,
  null,
  null,
  true,
  true,
  '2026-03-01T00:00:00.000Z'::timestamptz,
  '2026-04-18T02:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  content = excluded.content,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  image_url = excluded.image_url,
  gallery = excluded.gallery,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  featured = excluded.featured,
  published = excluded.published,
  updated_at = excluded.updated_at;

insert into public.projects (
  id, title, slug, description, content, category, status, tech_stack, image_url, gallery,
  demo_url, github_url, featured, published, created_at, updated_at
) values (
  '22222222-2222-4222-8222-222222222223'::uuid,
  'Personal Portfolio',
  'personal-portfolio',
  'My personal portfolio website with projects, a learning journal, certificates, and a contact form.',
  '{"overview":"This website is the portfolio itself. It collects projects, a learning journal, certificates, and a contact form, with an administrator dashboard for keeping the content up to date.","problem":"A static page is hard to update before an internship application. I wanted a site I could edit without redeploying every paragraph.","objectives":["Present projects, studies, and a way to get in touch.","Store published content in a database.","Keep drafts and contact messages private."],"target_users":"Instructors, internship reviewers, and anyone who wants a clear view of my current work.","features":["Project pages with a unique slug","Search and category filters","A journal with published and draft posts","A contact form saved to the database","An administrator dashboard with sign-in"],"process":"I designed the shared navigation and footer first, then the public pages, then the database rules. Public visitors can read published work. Only an account listed as an administrator can change it. The contact form is checked on the server before it is saved.","challenges":[{"challenge":"Hiding the dashboard link is not the same as protecting the data.","solution":"Admin pages check the session on the server, and the database policies allow writes only for administrator accounts."},{"challenge":"Sample content can be mistaken for a finished personal record.","solution":"The profile, projects, and journal are editable, and the README lists exactly what to replace."}],"lessons":["A consistent card, button, and spacing system makes new pages faster to build.","Authentication and database rules belong in the plan, not at the end."]}'::jsonb,
  'Portfolio',
  'In progress',
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  '/images/projects/portfolio.svg',
  '[{"url":"/images/projects/portfolio.svg","alt":"Illustrated preview of this portfolio homepage"}]'::jsonb,
  null,
  'https://github.com/micarejie/WasteToReward',
  true,
  true,
  '2026-04-01T00:00:00.000Z'::timestamptz,
  '2026-04-18T02:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  content = excluded.content,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  image_url = excluded.image_url,
  gallery = excluded.gallery,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  featured = excluded.featured,
  published = excluded.published,
  updated_at = excluded.updated_at;

insert into public.blog_posts (
  id, title, slug, excerpt, content, cover_image_url, category, tags, published, published_at, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333331'::uuid,
  'My First Experience with Tailwind CSS',
  'my-first-experience-with-tailwind-css',
  'What felt noisy on the first day, and the small habits that made utility classes easier to read.',
  '## The first impression

I opened a component and saw a long class string where I expected a stylesheet. It looked harder to read than the CSS I already knew. I almost went back to writing every rule by hand.

## What helped

I stopped trying to memorize the whole framework. I learned the spacing scale, color names, and layout utilities I actually used: `flex`, `grid`, `gap`, `px`, and `rounded`. When a pattern showed up twice, I moved it into a component instead of copying a longer class list.

A few habits made the markup calmer:

- Keep one job in a component, such as a button or a card.
- Use the same spacing steps across a page.
- Check the page at a phone width before adding more decoration.

## A small example

```
<a class="rounded-full bg-primary px-5 py-2.5 text-sm text-white">
  View My Projects
</a>
```

That is enough for a pill button. Hover and focus styles can sit beside it without a separate stylesheet for every page.

## What I would tell another student

Tailwind did not replace learning CSS. It made the box model, flexbox, and responsive prefixes more visible. I still look up a class when I forget it. The documentation is the point, not a sign that I failed to memorize it.

The [Tailwind CSS documentation](https://tailwindcss.com/docs) is the reference I keep open.',
  '/images/blog/tailwind.svg',
  'Web Development',
  array['Tailwind CSS', 'CSS', 'Learning'],
  true,
  '2026-04-18T00:00:00.000Z'::timestamptz,
  '2026-04-18T00:00:00.000Z'::timestamptz,
  '2026-04-18T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  category = excluded.category,
  tags = excluded.tags,
  published = excluded.published,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

insert into public.blog_posts (
  id, title, slug, excerpt, content, cover_image_url, category, tags, published, published_at, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333332'::uuid,
  'How I Connected My Website to Supabase',
  'how-i-connected-my-website-to-supabase',
  'The steps that mattered: environment variables, the server client, and row level security.',
  '## Why the connection felt bigger than a URL

I thought connecting the site meant pasting a project URL and reading a table. The first query returned nothing. The table had rows, but row level security was on and I had not written a policy that allowed the public role to read them.

That empty result was useful. It showed that the database was refusing the request, not that the client was broken.

## What I set up

1. A Supabase project and the SQL for profiles, projects, posts, certificates, and messages.
2. The project URL and the publishable key in environment variables.
3. A server client for pages and a browser client only where the dashboard needs one.
4. Policies that let visitors read published work and let only an administrator change it.

The service-role key stays out of the browser. It is not required for the public site. An administrator signs in with Supabase Auth, and the database checks that the account is in the admin list.

## A mistake I will not repeat

I almost treated every signed-in user as an administrator. That would make a normal account able to edit the portfolio. The admin check is a separate table, and the policies call that check.

## Where to read more

The [Supabase docs for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) are the guide I followed for the cookie-based client.',
  '/images/blog/supabase.svg',
  'Databases',
  array['Supabase', 'PostgreSQL', 'Security'],
  true,
  '2026-02-26T00:00:00.000Z'::timestamptz,
  '2026-02-26T00:00:00.000Z'::timestamptz,
  '2026-02-26T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  category = excluded.category,
  tags = excluded.tags,
  published = excluded.published,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

insert into public.blog_posts (
  id, title, slug, excerpt, content, cover_image_url, category, tags, published, published_at, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333333'::uuid,
  'Lessons Learned from Developing My First Web Application',
  'lessons-from-my-first-web-application',
  'Planning the pages first, keeping the form honest, and fixing one broken path at a time.',
  '## I started with the screens

My first useful step was not a component library. It was a list of screens and what each button should do. When I skipped that, I built pieces that did not connect.

For a small app I now write three things before the styling:

- Who uses the page.
- What they can submit or open.
- What should be saved, and what should stay private.

## Forms taught me to check the server

A required attribute on an input is helpful, and it is not enough. Someone can send a request without the page. I check the same limits again on the server: required fields, email shape, and a maximum length.

## One bug at a time

When a page failed, I used to change several things and then guess which one fixed it. That made the next bug worse. Now I reproduce the problem, change one part, and try the same path again.

## What I kept

The first app did not need a clever animation. It needed a readable layout, a working form, and a way to see the saved data. Those are the pieces I still look for when I review my own work.',
  '/images/blog/first-app.svg',
  'Web Development',
  array['Projects', 'Forms', 'Learning'],
  true,
  '2026-01-20T00:00:00.000Z'::timestamptz,
  '2026-01-20T00:00:00.000Z'::timestamptz,
  '2026-01-20T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  category = excluded.category,
  tags = excluded.tags,
  published = excluded.published,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

insert into public.blog_posts (
  id, title, slug, excerpt, content, cover_image_url, category, tags, published, published_at, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333334'::uuid,
  'My Journey as an IT Student',
  'my-journey-as-an-it-student',
  'Notes from studying information technology, and a few practices that made the work less confusing.',
  '## Starting out

Information technology covers more than one job. In the same term I can meet programming, databases, and interface design. Early on I tried to learn all of it at the same depth. I retained more when I tied each topic to a small thing I could build.

## Practices that helped

- Rewrite a lesson in my own words after class.
- Build a tiny version of the idea, even if it is only one page.
- Ask for the requirement again when I am about to invent a feature nobody asked for.
- Keep a list of terms I can explain out loud.

## Advice I would give a new student

You do not need a perfect portfolio on the first month. You need one project you can explain: what it is for, what you built, and what you would change. This site is my place to practice that explanation.

Replace these notes with your own story. The sample text is here so the journal has a real page to read.',
  '/images/blog/journey.svg',
  'Student Life',
  array['IT Student', 'Study Habits'],
  true,
  '2025-09-09T00:00:00.000Z'::timestamptz,
  '2025-09-09T00:00:00.000Z'::timestamptz,
  '2025-09-09T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  category = excluded.category,
  tags = excluded.tags,
  published = excluded.published,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

insert into public.blog_posts (
  id, title, slug, excerpt, content, cover_image_url, category, tags, published, published_at, created_at, updated_at
) values (
  '33333333-3333-4333-8333-333333333335'::uuid,
  'Challenges in Building My Capstone Project',
  'challenges-in-building-my-capstone',
  'How I am keeping the FoodLink capstone smaller than the first version I imagined.',
  '## The idea grew too fast

FoodLink started as a way for a local restaurant to take an order without a long chat thread. Within a day I had also sketched riders, live maps, coupons, and several user roles. None of those were required to test the basic idea.

## The cut I made

The version I can explain has a public menu, an order form, and a staff list of orders. Status changes are simple: received, preparing, and ready. Payment and delivery assignment can wait until that path works.

## What is still hard

Authentication and database rules take longer than the menu cards. A guest should read the menu. A guest should not read someone else''s order. Writing that rule down made the rest of the data model easier to check.

## What I want from the finished project

I want to demo one order from the menu to the staff queue and answer questions about the tables and the access rules. A smaller demo I understand is more useful than a large one I cannot trace.',
  '/images/blog/capstone.svg',
  'Capstone',
  array['Capstone', 'FoodLink', 'Planning'],
  true,
  '2026-03-12T00:00:00.000Z'::timestamptz,
  '2026-03-12T00:00:00.000Z'::timestamptz,
  '2026-03-12T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  category = excluded.category,
  tags = excluded.tags,
  published = excluded.published,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;

insert into public.certificates (
  id, title, issuer, description, date_earned, image_url, credential_url, featured, created_at, updated_at
) values (
  '44444444-4444-4444-8444-444444444441'::uuid,
  'Sample placeholder — not a real certificate',
  'Replace with the issuing organization',
  'This entry shows the certificate layout. Delete it and add a document you actually earned. It is not a credential, award, or qualification.',
  null,
  '/images/certificates/sample-document.svg',
  null,
  false,
  '2026-04-01T00:00:00.000Z'::timestamptz,
  '2026-04-01T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  description = excluded.description,
  date_earned = excluded.date_earned,
  image_url = excluded.image_url,
  credential_url = excluded.credential_url,
  featured = excluded.featured,
  updated_at = excluded.updated_at;

insert into public.certificates (
  id, title, issuer, description, date_earned, image_url, credential_url, featured, created_at, updated_at
) values (
  '44444444-4444-4444-8444-444444444442'::uuid,
  'Sample placeholder — workshop layout',
  'Replace with the workshop organizer',
  'A second sample card so the gallery can be reviewed with more than one item. Remove it when you add your own certificates.',
  null,
  '/images/certificates/sample-document.svg',
  null,
  false,
  '2026-04-02T00:00:00.000Z'::timestamptz,
  '2026-04-02T00:00:00.000Z'::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  description = excluded.description,
  date_earned = excluded.date_earned,
  image_url = excluded.image_url,
  credential_url = excluded.credential_url,
  featured = excluded.featured,
  updated_at = excluded.updated_at;
