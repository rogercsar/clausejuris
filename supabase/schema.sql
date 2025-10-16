-- Supabase Schema for Clause
-- Run this in your Supabase project SQL editor

-- Enable pgcrypto for gen_random_uuid (available by default on Supabase)
-- create extension if not exists pgcrypto;

-- Enums
create type user_plan as enum ('common', 'pro');
create type user_role as enum ('admin','senior_lawyer','junior_lawyer','intern','assistant','paralegal','client');
create type client_type as enum ('person', 'company');
create type contract_type as enum ('rental','service','purchase_sale','partnership','employment','other');
create type contract_status as enum ('active','ended','terminated');
create type process_type as enum ('civil','labor','criminal','family','administrative','other');
create type process_status as enum ('won','lost','in_progress','pending');
create type notification_type as enum ('contract_expiring','contract_expired','process_deadline','process_urgent','payment_due','document_required','court_hearing','custom');
create type notification_priority as enum ('low','medium','high','urgent');
create type entity_type as enum ('contract','process','document','task');
create type task_type as enum ('deadline','hearing','document_preparation','filing','response','appeal','meeting','research','review','custom');
create type task_priority as enum ('low','medium','high','urgent');
create type task_status as enum ('pending','in_progress','completed','cancelled','overdue');

-- Helper: trigger to update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Prevent role changes by non-service roles
create or replace function public.prevent_role_change()
returns trigger as $$
begin
  -- only allow changing role when request is made with service_role
  if auth.role() != 'service_role' then
    if new.role is distinct from old.role then
      raise exception 'Role changes are restricted to service role';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  full_name text,
  oab text,
  phone text,
  plan user_plan not null default 'common',
  role user_role,
  avatar text,
  document text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are viewable by owner" on public.profiles
  for select using (id = auth.uid());
create policy "Profiles are insertable by owner" on public.profiles
  for insert with check (id = auth.uid());
create policy "Profiles are updatable by owner" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create index if not exists profiles_email_idx on public.profiles(email);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure set_updated_at();
create trigger profiles_prevent_role_change before update on public.profiles
  for each row execute procedure public.prevent_role_change();

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  document text not null,
  type client_type not null,
  address text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.clients enable row level security;
create policy "Clients are visible to owner" on public.clients
  for select using (user_id = auth.uid());
create policy "Clients are creatable by owner" on public.clients
  for insert with check (user_id = auth.uid());
create policy "Clients are updatable by owner" on public.clients
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Clients are deletable by owner" on public.clients
  for delete using (user_id = auth.uid());
create index if not exists clients_user_idx on public.clients(user_id);
create trigger clients_set_updated_at before update on public.clients
  for each row execute procedure set_updated_at();

-- Contracts
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  type contract_type not null,
  client_name text not null,
  start_date date not null,
  end_date date,
  value numeric(12,2) not null,
  status contract_status not null,
  attachments jsonb not null default '[]',
  description text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.contracts enable row level security;
create policy "Contracts visible to owner" on public.contracts
  for select using (user_id = auth.uid());
create policy "Contracts creatable by owner" on public.contracts
  for insert with check (user_id = auth.uid());
create policy "Contracts updatable by owner" on public.contracts
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Contracts deletable by owner" on public.contracts
  for delete using (user_id = auth.uid());
create index if not exists contracts_user_idx on public.contracts(user_id);
create index if not exists contracts_client_idx on public.contracts(client_id);
create trigger contracts_set_updated_at before update on public.contracts
  for each row execute procedure set_updated_at();

-- Processes
create table if not exists public.processes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  type process_type not null,
  client_name text not null,
  status process_status not null,
  start_date date not null,
  end_date date,
  attachments jsonb not null default '[]',
  description text,
  court text,
  case_number text,
  against_who text,
  involved text,
  lawyer text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.processes enable row level security;
create policy "Processes visible to owner" on public.processes
  for select using (user_id = auth.uid());
create policy "Processes creatable by owner" on public.processes
  for insert with check (user_id = auth.uid());
create policy "Processes updatable by owner" on public.processes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Processes deletable by owner" on public.processes
  for delete using (user_id = auth.uid());
create index if not exists processes_user_idx on public.processes(user_id);
create index if not exists processes_client_idx on public.processes(client_id);
create trigger processes_set_updated_at before update on public.processes
  for each row execute procedure set_updated_at();

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  type task_type not null,
  priority task_priority not null,
  status task_status not null,
  process_id uuid references public.processes(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  assigned_to uuid,
  created_by uuid not null,
  due_date date not null,
  completed_at timestamp with time zone,
  reminder_days integer[] not null default '{}',
  tags text[] not null default '{}',
  attachments jsonb not null default '[]',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.tasks enable row level security;
create policy "Tasks visible to owner" on public.tasks
  for select using (user_id = auth.uid());
create policy "Tasks creatable by owner" on public.tasks
  for insert with check (user_id = auth.uid());
create policy "Tasks updatable by owner" on public.tasks
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Tasks deletable by owner" on public.tasks
  for delete using (user_id = auth.uid());
create index if not exists tasks_user_idx on public.tasks(user_id);
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute procedure set_updated_at();

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  message text not null,
  entity_id uuid,
  entity_type entity_type not null,
  entity_name text,
  priority notification_priority not null,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now(),
  scheduled_for timestamp with time zone,
  metadata jsonb,
  updated_at timestamp with time zone not null default now()
);
alter table public.notifications enable row level security;
create policy "Notifications visible to owner" on public.notifications
  for select using (user_id = auth.uid());
create policy "Notifications creatable by owner" on public.notifications
  for insert with check (user_id = auth.uid());
create policy "Notifications updatable by owner" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Notifications deletable by owner" on public.notifications
  for delete using (user_id = auth.uid());
create index if not exists notifications_user_idx on public.notifications(user_id);
create trigger notifications_set_updated_at before update on public.notifications
  for each row execute procedure set_updated_at();

-- Notification Settings
create table if not exists public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email_notifications boolean not null default true,
  browser_notifications boolean not null default true,
  contract_expiry_days integer[] not null default '{30,15,7,1}',
  process_deadline_days integer[] not null default '{30,15,7,1}',
  payment_reminder_days integer[] not null default '{7,3,1}',
  court_hearing_reminder_days integer[] not null default '{7,3,1}',
  quiet_hours jsonb not null default '{"enabled":false,"start":"22:00","end":"08:00"}',
  notification_types jsonb not null default '{"contract_expiring":true,"contract_expired":true,"process_deadline":true,"process_urgent":true,"payment_due":true,"document_required":true,"court_hearing":true,"custom":true}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.notification_settings enable row level security;
create policy "Settings visible to owner" on public.notification_settings
  for select using (user_id = auth.uid());
create policy "Settings creatable by owner" on public.notification_settings
  for insert with check (user_id = auth.uid());
create policy "Settings updatable by owner" on public.notification_settings
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Settings deletable by owner" on public.notification_settings
  for delete using (user_id = auth.uid());
create index if not exists notification_settings_user_idx on public.notification_settings(user_id);
create trigger notification_settings_set_updated_at before update on public.notification_settings
  for each row execute procedure set_updated_at();

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type entity_type not null,
  entity_id uuid not null,
  user_name text,
  user_role text,
  content text not null,
  parent_id uuid,
  is_resolved boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.comments enable row level security;
create policy "Comments visible to owner" on public.comments
  for select using (user_id = auth.uid());
create policy "Comments creatable by owner" on public.comments
  for insert with check (user_id = auth.uid());
create policy "Comments updatable by owner" on public.comments
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Comments deletable by owner" on public.comments
  for delete using (user_id = auth.uid());
create index if not exists comments_user_idx on public.comments(user_id);
create trigger comments_set_updated_at before update on public.comments
  for each row execute procedure set_updated_at();

-- Optional: Cross references (simple storage)
create table if not exists public.cross_references (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_id uuid not null,
  entity_type entity_type not null,
  relation_type text not null,
  details text,
  risk_level text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.cross_references enable row level security;
create policy "CrossRefs visible to owner" on public.cross_references
  for select using (user_id = auth.uid());
create policy "CrossRefs creatable by owner" on public.cross_references
  for insert with check (user_id = auth.uid());
create policy "CrossRefs updatable by owner" on public.cross_references
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "CrossRefs deletable by owner" on public.cross_references
  for delete using (user_id = auth.uid());
create index if not exists cross_references_user_idx on public.cross_references(user_id);
create trigger cross_references_set_updated_at before update on public.cross_references
  for each row execute procedure set_updated_at();

-- Notes:
-- 1) Run this script in the Supabase SQL editor.
-- 2) Ensure authentication email confirmations are configured per your project needs.
-- 3) The app expects a 'profiles' row for each user; insert happens at sign-up.