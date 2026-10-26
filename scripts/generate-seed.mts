import { writeFileSync } from "node:fs";
import { seedBundle } from "../lib/demo/seed-data.ts";

function sqlString(value) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function sqlArray(values) {
  if (!values?.length) return "array[]::text[]";
  return `array[${values.map((value) => sqlString(value)).join(", ")}]`;
}

function sqlBool(value) {
  return value ? "true" : "false";
}

const profile = seedBundle.profile;
const profileSql = `
insert into public.profiles (
  id, full_name, headline, tagline, motto, bio, email, avatar_url, resume_url,
  github_url, linkedin_url, location, interests, strengths, career_goals, skills, education, created_at, updated_at
)
select
  ${sqlString(profile.id)}::uuid,
  ${sqlString(profile.full_name)},
  ${sqlString(profile.headline)},
  ${sqlString(profile.tagline)},
  ${sqlString(profile.motto)},
  ${sqlString(profile.bio)},
  ${sqlString(profile.email)},
  ${sqlString(profile.avatar_url)},
  ${sqlString(profile.resume_url)},
  ${sqlString(profile.github_url)},
  ${sqlString(profile.linkedin_url)},
  ${sqlString(profile.location)},
  ${sqlArray(profile.interests)},
  ${sqlArray(profile.strengths)},
  ${sqlString(profile.career_goals)},
  ${sqlJson(profile.skills)},
  ${sqlJson(profile.education)},
  ${sqlString(profile.created_at)}::timestamptz,
  ${sqlString(profile.updated_at)}::timestamptz
where not exists (select 1 from public.profiles);
`;

const projectSql = seedBundle.projects
  .map(
    (project) => `insert into public.projects (
  id, title, slug, description, content, category, status, tech_stack, image_url, gallery,
  demo_url, github_url, featured, published, created_at, updated_at
) values (
  ${sqlString(project.id)}::uuid,
  ${sqlString(project.title)},
  ${sqlString(project.slug)},
  ${sqlString(project.description)},
  ${sqlJson(project.content)},
  ${sqlString(project.category)},
  ${sqlString(project.status)},
  ${sqlArray(project.tech_stack)},
  ${sqlString(project.image_url)},
  ${sqlJson(project.gallery)},
  ${sqlString(project.demo_url)},
  ${sqlString(project.github_url)},
  ${sqlBool(project.featured)},
  ${sqlBool(project.published)},
  ${sqlString(project.created_at)}::timestamptz,
  ${sqlString(project.updated_at)}::timestamptz
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
  updated_at = excluded.updated_at;`,
  )
  .join("\n\n");

const postSql = seedBundle.posts
  .map(
    (post) => `insert into public.blog_posts (
  id, title, slug, excerpt, content, cover_image_url, category, tags, published, published_at, created_at, updated_at
) values (
  ${sqlString(post.id)}::uuid,
  ${sqlString(post.title)},
  ${sqlString(post.slug)},
  ${sqlString(post.excerpt)},
  ${sqlString(post.content)},
  ${sqlString(post.cover_image_url)},
  ${sqlString(post.category)},
  ${sqlArray(post.tags)},
  ${sqlBool(post.published)},
  ${sqlString(post.published_at)}::timestamptz,
  ${sqlString(post.created_at)}::timestamptz,
  ${sqlString(post.updated_at)}::timestamptz
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
  updated_at = excluded.updated_at;`,
  )
  .join("\n\n");

const certificateSql = seedBundle.certificates
  .map(
    (item) => `insert into public.certificates (
  id, title, issuer, description, date_earned, image_url, credential_url, featured, created_at, updated_at
) values (
  ${sqlString(item.id)}::uuid,
  ${sqlString(item.title)},
  ${sqlString(item.issuer)},
  ${sqlString(item.description)},
  ${item.date_earned ? `${sqlString(item.date_earned)}::date` : "null"},
  ${sqlString(item.image_url)},
  ${sqlString(item.credential_url)},
  ${sqlBool(item.featured)},
  ${sqlString(item.created_at)}::timestamptz,
  ${sqlString(item.updated_at)}::timestamptz
) on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  description = excluded.description,
  date_earned = excluded.date_earned,
  image_url = excluded.image_url,
  credential_url = excluded.credential_url,
  featured = excluded.featured,
  updated_at = excluded.updated_at;`,
  )
  .join("\n\n");

const sql = `-- Sample portfolio content.
-- Safe to run more than once. The profile row is inserted only when the table is empty.
-- Project, article, and certificate rows use fixed sample ids.
-- Replace this content with your own work. The certificate rows are layout placeholders, not credentials.

${profileSql}

${projectSql}

${postSql}

${certificateSql}
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log("Wrote supabase/seed.sql");
