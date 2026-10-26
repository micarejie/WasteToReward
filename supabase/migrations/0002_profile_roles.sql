-- Adds the rotating hero roles. Safe to run after 0001_init.sql.

alter table public.profiles
  add column if not exists roles text[] not null default '{}';
