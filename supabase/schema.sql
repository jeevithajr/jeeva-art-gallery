-- Run in Supabase SQL Editor. Create an auth user in the dashboard first.
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text not null unique,
 description text not null default '',
 price numeric(12,2) not null check (price >= 0),
 category text not null default '',
 images text[] not null default '{}',
 is_available boolean not null default true,
 is_published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
alter table public.products enable row level security;
create policy "admin can see own membership" on public.admins for select to authenticated using (user_id = auth.uid());
create policy "public can view published art" on public.products for select to anon,authenticated using (is_published or exists(select 1 from public.admins where user_id=auth.uid()));
create policy "admin can insert" on public.products for insert to authenticated with check (exists(select 1 from public.admins where user_id=auth.uid()));
create policy "admin can update" on public.products for update to authenticated using (exists(select 1 from public.admins where user_id=auth.uid())) with check (exists(select 1 from public.admins where user_id=auth.uid()));
create policy "admin can delete" on public.products for delete to authenticated using (exists(select 1 from public.admins where user_id=auth.uid()));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('artworks','artworks',true,5242880,array['image/jpeg','image/png','image/webp','image/gif']) on conflict(id) do nothing;
create policy "public can view artwork images" on storage.objects for select to public using (bucket_id='artworks');
create policy "admins can upload images" on storage.objects for insert to authenticated with check (bucket_id='artworks' and exists(select 1 from public.admins where user_id=auth.uid()));
create policy "admins can remove images" on storage.objects for delete to authenticated using (bucket_id='artworks' and exists(select 1 from public.admins where user_id=auth.uid()));
-- After creating your admin user, run this separately with the real user UUID:
-- insert into public.admins(user_id) values ('YOUR_AUTH_USER_UUID');
