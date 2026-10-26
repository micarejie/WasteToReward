import type { BlogPost, Certificate, Profile, Project } from "@/types/portfolio";

export const SEED_VERSION = 3;

const now = "2026-04-18T02:00:00.000Z";

export const seedProfile: Profile = {
  id: "11111111-1111-4111-8111-111111111111",
  full_name: "Mica Dames",
  headline: "IT Student & Aspiring Developer",
  tagline: "Building meaningful digital experiences through technology.",
  motto: "Better code. Brighter future.",
  bio: "I build simple and functional web applications, turning ideas into real solutions. I'm currently exploring web development, databases, and UI/UX design while pursuing my degree in Information Technology.",
  email: "hello@example.com",
  avatar_url: "/images/profile.jpg",
  resume_url: "/resume.pdf",
  github_url: "https://github.com/micarejie",
  linkedin_url: "https://www.linkedin.com/",
  location: "Philippines",
  interests: ["Web Development", "Databases", "UI/UX Design", "Tech and Gadgets"],
  strengths: [
    "I break a feature into small pieces before I start coding.",
    "I pay attention to contrast, spacing, and keyboard access.",
    "I keep notes on what I learn so the next project is easier.",
  ],
  career_goals:
    "I am looking for an internship where I can help build real web applications, practice databases and interface design, and grow into a dependable junior developer.",
  roles: ["an IT Student", "a Web Developer", "a Programmer"],
  skills: [
    { name: "HTML", category: "Frontend Development", level: "Comfortable" },
    { name: "CSS", category: "Frontend Development", level: "Comfortable" },
    { name: "JavaScript", category: "Frontend Development", level: "Comfortable" },
    { name: "Tailwind CSS", category: "Frontend Development", level: "Learning" },
    { name: "React", category: "Frontend Development", level: "Learning" },
    { name: "Next.js", category: "Frontend Development", level: "Learning" },
    { name: "PHP", category: "Backend Development", level: "Familiar" },
    { name: "PostgreSQL", category: "Database Management", level: "Learning" },
    { name: "Supabase", category: "Database Management", level: "Learning" },
    { name: "JavaScript", category: "Programming Languages", level: "Comfortable" },
    { name: "PHP", category: "Programming Languages", level: "Familiar" },
    { name: "SQL", category: "Programming Languages", level: "Learning" },
    { name: "Figma", category: "UI/UX Design", level: "Familiar" },
    { name: "Git and GitHub", category: "Development Tools", level: "Comfortable" },
    { name: "Visual Studio Code", category: "Development Tools", level: "Comfortable" },
  ],
  education: [
    {
      school: "Add your college or university",
      credential: "Bachelor of Science in Information Technology",
      period: "In progress",
      location: "Philippines",
      details:
        "Coursework and personal practice in web development, databases, and software fundamentals. Replace this entry with your school, year level, and subjects.",
      status: "In progress",
    },
  ],
  created_at: "2026-01-15T00:00:00.000Z",
  updated_at: now,
};

export const seedProjects: Project[] = [
  {
    id: "22222222-2222-4222-8222-222222222221",
    title: "Waste-to-Reward",
    slug: "waste-to-reward",
    description:
      "A web system that encourages proper waste segregation and rewards users with points.",
    category: "Web Application",
    status: "In progress",
    tech_stack: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    image_url: "/images/projects/waste-to-reward.svg",
    gallery: [
      {
        url: "/images/projects/waste-to-reward.svg",
        alt: "Illustrated preview of the Waste-to-Reward dashboard",
      },
    ],
    demo_url: null,
    github_url: "https://github.com/micarejie/WasteToReward",
    featured: true,
    published: true,
    created_at: "2026-02-02T00:00:00.000Z",
    updated_at: now,
    content: {
      overview:
        "Waste-to-Reward is a sample student project about making waste segregation easier to understand. The idea is a small web app where a household or campus group can log sorted waste and see points for consistent habits.",
      problem:
        "Sorting waste is easy to postpone when the rules feel unclear and there is no visible record of doing it correctly. A simple tracker can make the habit easier to follow.",
      objectives: [
        "Explain the main waste categories in plain language.",
        "Let a user record a sorting activity.",
        "Show points as feedback, not as a made-up public ranking.",
      ],
      target_users: "Students and households who want a straightforward way to practice waste segregation.",
      features: [
        "Category guide for common waste types",
        "A simple log for sorting activities",
        "A points summary for the signed-in user",
        "A clean layout that works on a phone",
      ],
      process:
        "I started with the user flow: learn the categories, record one action, and see the updated points. The interface uses a small set of cards so the first screen stays quiet. The data model keeps users, categories, and activity logs separate.",
      challenges: [
        {
          challenge: "A points system can become the focus instead of the habit.",
          solution: "Points stay private to the user and only reflect their own log. The project does not invent community rankings.",
        },
        {
          challenge: "The category rules are not the same in every city.",
          solution: "The guide is written as editable content so it can be corrected for a real local policy later.",
        },
      ],
      lessons: [
        "A narrow first version is easier to explain than a marketplace of rewards.",
        "Naming the tables clearly saved time once the forms were connected.",
      ],
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "FoodLink",
    slug: "foodlink",
    description: "A food ordering and delivery platform for local restaurants, planned as a capstone project.",
    category: "Capstone",
    status: "In progress",
    tech_stack: ["Next.js", "Supabase", "Tailwind CSS"],
    image_url: "/images/projects/foodlink.svg",
    gallery: [
      { url: "/images/projects/foodlink.svg", alt: "Illustrated preview of the FoodLink ordering screen" },
    ],
    demo_url: null,
    github_url: null,
    featured: true,
    published: true,
    created_at: "2026-03-01T00:00:00.000Z",
    updated_at: now,
    content: {
      overview:
        "FoodLink is the working name of my capstone concept: a modest ordering site for local restaurants. Guests browse a short menu, place an order, and the restaurant sees the order in a simple queue.",
      problem:
        "Small restaurants often take orders through chat messages. Details get lost, and the customer cannot see a clear menu or order status.",
      objectives: [
        "Show a readable menu with prices.",
        "Accept an order with contact details and notes.",
        "Give the restaurant one list of new orders.",
      ],
      target_users: "Local restaurant staff and customers who want a direct ordering page without a large delivery marketplace.",
      features: [
        "Menu cards with name, price, and a short note",
        "An order form with validation",
        "Order status: received, preparing, ready",
        "A staff view protected by authentication",
      ],
      process:
        "I mapped the guest path and the staff path before choosing tables. Supabase fits the project because authentication, the database, and row level security can live in one place. The public menu is readable by anyone. Orders are readable only by an administrator.",
      challenges: [
        {
          challenge: "Delivery tracking, payments, and rider assignment made the scope too large.",
          solution: "The first version stops at placing an order and updating its status. Payments can be added later if the basic flow is solid.",
        },
        {
          challenge: "A public form will receive messy input.",
          solution: "The server checks required fields, email shape, and message length before anything is stored.",
        },
      ],
      lessons: [
        "Writing the security rule in a sentence first made the database policy easier to draft.",
        "A capstone is easier to defend when every feature maps to a user task.",
      ],
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222223",
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    description: "My personal portfolio website with projects, a learning journal, certificates, and a contact form.",
    category: "Portfolio",
    status: "In progress",
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    image_url: "/images/projects/portfolio.svg",
    gallery: [
      { url: "/images/projects/portfolio.svg", alt: "Illustrated preview of this portfolio homepage" },
    ],
    demo_url: null,
    github_url: "https://github.com/micarejie/WasteToReward",
    featured: true,
    published: true,
    created_at: "2026-04-01T00:00:00.000Z",
    updated_at: now,
    content: {
      overview:
        "This website is the portfolio itself. It collects projects, a learning journal, certificates, and a contact form, with an administrator dashboard for keeping the content up to date.",
      problem:
        "A static page is hard to update before an internship application. I wanted a site I could edit without redeploying every paragraph.",
      objectives: [
        "Present projects, studies, and a way to get in touch.",
        "Store published content in a database.",
        "Keep drafts and contact messages private.",
      ],
      target_users: "Instructors, internship reviewers, and anyone who wants a clear view of my current work.",
      features: [
        "Project pages with a unique slug",
        "Search and category filters",
        "A journal with published and draft posts",
        "A contact form saved to the database",
        "An administrator dashboard with sign-in",
      ],
      process:
        "I designed the shared navigation and footer first, then the public pages, then the database rules. Public visitors can read published work. Only an account listed as an administrator can change it. The contact form is checked on the server before it is saved.",
      challenges: [
        {
          challenge: "Hiding the dashboard link is not the same as protecting the data.",
          solution: "Admin pages check the session on the server, and the database policies allow writes only for administrator accounts.",
        },
        {
          challenge: "Sample content can be mistaken for a finished personal record.",
          solution: "The profile, projects, and journal are editable, and the README lists exactly what to replace.",
        },
      ],
      lessons: [
        "A consistent card, button, and spacing system makes new pages faster to build.",
        "Authentication and database rules belong in the plan, not at the end.",
      ],
    },
  },
];

export const seedPosts: BlogPost[] = [
  {
    id: "33333333-3333-4333-8333-333333333331",
    title: "My First Experience with Tailwind CSS",
    slug: "my-first-experience-with-tailwind-css",
    excerpt: "What felt noisy on the first day, and the small habits that made utility classes easier to read.",
    category: "Web Development",
    tags: ["Tailwind CSS", "CSS", "Learning"],
    cover_image_url: "/images/blog/tailwind.svg",
    published: true,
    published_at: "2026-04-18T00:00:00.000Z",
    created_at: "2026-04-18T00:00:00.000Z",
    updated_at: "2026-04-18T00:00:00.000Z",
    content: `## The first impression

I opened a component and saw a long class string where I expected a stylesheet. It looked harder to read than the CSS I already knew. I almost went back to writing every rule by hand.

## What helped

I stopped trying to memorize the whole framework. I learned the spacing scale, color names, and layout utilities I actually used: \`flex\`, \`grid\`, \`gap\`, \`px\`, and \`rounded\`. When a pattern showed up twice, I moved it into a component instead of copying a longer class list.

A few habits made the markup calmer:

- Keep one job in a component, such as a button or a card.
- Use the same spacing steps across a page.
- Check the page at a phone width before adding more decoration.

## A small example

\`\`\`
<a class="rounded-full bg-primary px-5 py-2.5 text-sm text-white">
  View My Projects
</a>
\`\`\`

That is enough for a pill button. Hover and focus styles can sit beside it without a separate stylesheet for every page.

## What I would tell another student

Tailwind did not replace learning CSS. It made the box model, flexbox, and responsive prefixes more visible. I still look up a class when I forget it. The documentation is the point, not a sign that I failed to memorize it.

The [Tailwind CSS documentation](https://tailwindcss.com/docs) is the reference I keep open.`,
  },
  {
    id: "33333333-3333-4333-8333-333333333332",
    title: "How I Connected My Website to Supabase",
    slug: "how-i-connected-my-website-to-supabase",
    excerpt: "The steps that mattered: environment variables, the server client, and row level security.",
    category: "Databases",
    tags: ["Supabase", "PostgreSQL", "Security"],
    cover_image_url: "/images/blog/supabase.svg",
    published: true,
    published_at: "2026-02-26T00:00:00.000Z",
    created_at: "2026-02-26T00:00:00.000Z",
    updated_at: "2026-02-26T00:00:00.000Z",
    content: `## Why the connection felt bigger than a URL

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

The [Supabase docs for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) are the guide I followed for the cookie-based client.`,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Lessons Learned from Developing My First Web Application",
    slug: "lessons-from-my-first-web-application",
    excerpt: "Planning the pages first, keeping the form honest, and fixing one broken path at a time.",
    category: "Web Development",
    tags: ["Projects", "Forms", "Learning"],
    cover_image_url: "/images/blog/first-app.svg",
    published: true,
    published_at: "2026-01-20T00:00:00.000Z",
    created_at: "2026-01-20T00:00:00.000Z",
    updated_at: "2026-01-20T00:00:00.000Z",
    content: `## I started with the screens

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

The first app did not need a clever animation. It needed a readable layout, a working form, and a way to see the saved data. Those are the pieces I still look for when I review my own work.`,
  },
  {
    id: "33333333-3333-4333-8333-333333333334",
    title: "My Journey as an IT Student",
    slug: "my-journey-as-an-it-student",
    excerpt: "Notes from studying information technology, and a few practices that made the work less confusing.",
    category: "Student Life",
    tags: ["IT Student", "Study Habits"],
    cover_image_url: "/images/blog/journey.svg",
    published: true,
    published_at: "2025-09-09T00:00:00.000Z",
    created_at: "2025-09-09T00:00:00.000Z",
    updated_at: "2025-09-09T00:00:00.000Z",
    content: `## Starting out

Information technology covers more than one job. In the same term I can meet programming, databases, and interface design. Early on I tried to learn all of it at the same depth. I retained more when I tied each topic to a small thing I could build.

## Practices that helped

- Rewrite a lesson in my own words after class.
- Build a tiny version of the idea, even if it is only one page.
- Ask for the requirement again when I am about to invent a feature nobody asked for.
- Keep a list of terms I can explain out loud.

## Advice I would give a new student

You do not need a perfect portfolio on the first month. You need one project you can explain: what it is for, what you built, and what you would change. This site is my place to practice that explanation.

Replace these notes with your own story. The sample text is here so the journal has a real page to read.`,
  },
  {
    id: "33333333-3333-4333-8333-333333333335",
    title: "Challenges in Building My Capstone Project",
    slug: "challenges-in-building-my-capstone",
    excerpt: "How I am keeping the FoodLink capstone smaller than the first version I imagined.",
    category: "Capstone",
    tags: ["Capstone", "FoodLink", "Planning"],
    cover_image_url: "/images/blog/capstone.svg",
    published: true,
    published_at: "2026-03-12T00:00:00.000Z",
    created_at: "2026-03-12T00:00:00.000Z",
    updated_at: "2026-03-12T00:00:00.000Z",
    content: `## The idea grew too fast

FoodLink started as a way for a local restaurant to take an order without a long chat thread. Within a day I had also sketched riders, live maps, coupons, and several user roles. None of those were required to test the basic idea.

## The cut I made

The version I can explain has a public menu, an order form, and a staff list of orders. Status changes are simple: received, preparing, and ready. Payment and delivery assignment can wait until that path works.

## What is still hard

Authentication and database rules take longer than the menu cards. A guest should read the menu. A guest should not read someone else's order. Writing that rule down made the rest of the data model easier to check.

## What I want from the finished project

I want to demo one order from the menu to the staff queue and answer questions about the tables and the access rules. A smaller demo I understand is more useful than a large one I cannot trace.`,
  },
];

export const seedCertificates: Certificate[] = [
  {
    id: "44444444-4444-4444-8444-444444444441",
    title: "Sample placeholder — not a real certificate",
    issuer: "Replace with the issuing organization",
    description:
      "This entry shows the certificate layout. Delete it and add a document you actually earned. It is not a credential, award, or qualification.",
    date_earned: null,
    image_url: "/images/certificates/sample-document.svg",
    credential_url: null,
    featured: false,
    created_at: "2026-04-01T00:00:00.000Z",
    updated_at: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "44444444-4444-4444-8444-444444444442",
    title: "Sample placeholder — workshop layout",
    issuer: "Replace with the workshop organizer",
    description:
      "A second sample card so the gallery can be reviewed with more than one item. Remove it when you add your own certificates.",
    date_earned: null,
    image_url: "/images/certificates/sample-document.svg",
    credential_url: null,
    featured: false,
    created_at: "2026-04-02T00:00:00.000Z",
    updated_at: "2026-04-02T00:00:00.000Z",
  },
];

export const seedBundle = {
  version: SEED_VERSION,
  profile: seedProfile,
  projects: seedProjects,
  posts: seedPosts,
  certificates: seedCertificates,
  messages: [] as [],
};
