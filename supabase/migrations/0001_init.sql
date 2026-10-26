-- Portfolio schema for Supabase.
-- Run this migration in the Supabase SQL editor or with the Supabase CLI.
-- It creates the public tables, administrator check, row level security,
-- and storage buckets. It does not create a login. Use scripts/create-admin.mjs
-- after you have a Supabase project.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_blog_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.published = true and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  headline text not null default '',
  tagline text not null default '',
  motto text not null default '',
  bio text not null default '',
  email text not null,
  avatar_url text not null default '',
  resume_url text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',
  location text,
  interests text[] not null default '{}',
  strengths text[] not null default '{}',
  career_goals text not null default '',
  skills jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  singleton boolean not null default true unique check (singleton),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint profiles_name_length check (char_length(full_name) between 2 and 80)
);

comment on table public.profiles is
  'One public portfolio profile. skills, education, motto, tagline, interests, strengths, and career_goals extend the required columns so the About page can be edited in the dashboard.';

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  content jsonb not null default '{}'::jsonb,
  category text not null,
  status text not null default 'In progress',
  tech_stack text[] not null default '{}',
  image_url text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  demo_url text,
  github_url text,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint projects_status_value check (status in ('Planned', 'In progress', 'Completed')),
  constraint projects_title_length check (char_length(title) between 3 and 120)
);

comment on column public.projects.content is
  'Structured project detail: overview, problem, objectives, target_users, features, process, challenges, lessons.';
comment on column public.projects.gallery is
  'Array of { "url": "...", "alt": "..." } objects.';
comment on column public.projects.status is
  'Shown on project cards. Not part of the minimum brief, added so status is editable.';

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text not null default '',
  category text not null,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blog_posts_title_length check (char_length(title) between 3 and 140)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  description text not null default '',
  date_earned date,
  image_url text not null default '',
  credential_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certificates_title_length check (char_length(title) between 3 and 140)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint messages_name_length check (char_length(name) between 2 and 80),
  constraint messages_subject_length check (char_length(subject) between 3 and 140),
  constraint messages_body_length check (char_length(message) between 10 and 4000),
  constraint messages_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index projects_published_featured_idx on public.projects (published, featured);
create index projects_category_idx on public.projects (category);
create index blog_posts_published_idx on public.blog_posts (published, published_at desc);
create index blog_posts_category_idx on public.blog_posts (category);
create index certificates_featured_idx on public.certificates (featured, date_earned desc);
create index messages_read_created_idx on public.messages (is_read, created_at desc);

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger projects_touch_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

create trigger blog_posts_touch_updated_at
before update on public.blog_posts
for each row execute function public.touch_updated_at();

create trigger blog_posts_set_published_at
before insert or update on public.blog_posts
for each row execute function public.set_blog_published_at();

create trigger certificates_touch_updated_at
before update on public.certificates
for each row execute function public.touch_updated_at();

alter table public.admins enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.certificates enable row level security;
alter table public.messages enable row level security;

alter table public.admins force row level security;
alter table public.profiles force row level security;
alter table public.projects force row level security;
alter table public.blog_posts force row level security;
alter table public.certificates force row level security;
alter table public.messages force row level security;

revoke all on public.admins, public.profiles, public.projects, public.blog_posts, public.certificates, public.messages from anon, authenticated;

grant select on public.profiles, public.projects, public.blog_posts, public.certificates to anon, authenticated;
grant insert, update, delete on public.profiles, public.projects, public.blog_posts, public.certificates to authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
grant select on public.admins to authenticated;

create policy "admins read own row"
on public.admins
for select
to authenticated
using (user_id = auth.uid());

create policy "public read profile"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "admins insert profile"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

create policy "admins update profile"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete profile"
on public.profiles
for delete
to authenticated
using (public.is_admin());

create policy "public read published projects"
on public.projects
for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "admins insert projects"
on public.projects
for insert
to authenticated
with check (public.is_admin());

create policy "admins update projects"
on public.projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete projects"
on public.projects
for delete
to authenticated
using (public.is_admin());

create policy "public read published posts"
on public.blog_posts
for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "admins insert posts"
on public.blog_posts
for insert
to authenticated
with check (public.is_admin());

create policy "admins update posts"
on public.blog_posts
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete posts"
on public.blog_posts
for delete
to authenticated
using (public.is_admin());

create policy "public read certificates"
on public.certificates
for select
to anon, authenticated
using (true);

create policy "admins insert certificates"
on public.certificates
for insert
to authenticated
with check (public.is_admin());

create policy "admins update certificates"
on public.certificates
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete certificates"
on public.certificates
for delete
to authenticated
using (public.is_admin());

create policy "anyone can submit a message"
on public.messages
for insert
to anon, authenticated
with check (
  is_read = false
  and char_length(name) between 2 and 80
  and char_length(subject) between 3 and 140
  and char_length(message) between 10 and 4000
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

create policy "admins read messages"
on public.messages
for select
to authenticated
using (public.is_admin());

create policy "admins update messages"
on public.messages
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete messages"
on public.messages
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('projects', 'projects', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('blog', 'blog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('certificates', 'certificates', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('resumes', 'resumes', true, 8388608, array['application/pdf'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- The resume bucket is public because the site offers the file for download.
-- Do not put private documents in these buckets.

create policy "public read portfolio files"
on storage.objects
for select
to anon, authenticated
using (bucket_id in ('avatars', 'projects', 'blog', 'certificates', 'resumes'));

create policy "admins upload portfolio files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('avatars', 'projects', 'blog', 'certificates', 'resumes')
  and public.is_admin()
);

create policy "admins update portfolio files"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('avatars', 'projects', 'blog', 'certificates', 'resumes')
  and public.is_admin()
)
with check (
  bucket_id in ('avatars', 'projects', 'blog', 'certificates', 'resumes')
  and public.is_admin()
);

create policy "admins delete portfolio files"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('avatars', 'projects', 'blog', 'certificates', 'resumes')
  and public.is_admin()
);
