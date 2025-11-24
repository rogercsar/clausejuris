-- Supabase Schema for Clause
-- Run this in your Supabase project SQL editor

-- Enable pgcrypto for gen_random_uuid (available by default on Supabase)
-- create extension if not exists pgcrypto;

-- Enums (create only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_plan') THEN
    CREATE TYPE user_plan AS ENUM ('common', 'start', 'pro', 'office');
  ELSE
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'user_plan'::regtype AND enumlabel = 'start') THEN
      ALTER TYPE user_plan ADD VALUE 'start';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'user_plan'::regtype AND enumlabel = 'office') THEN
      ALTER TYPE user_plan ADD VALUE 'office';
    END IF;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin','senior_lawyer','junior_lawyer','intern','assistant','paralegal','client');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_type') THEN
    CREATE TYPE client_type AS ENUM ('person', 'company');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_type') THEN
    CREATE TYPE contract_type AS ENUM ('rental','service','purchase_sale','partnership','employment','other');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
    CREATE TYPE contract_status AS ENUM ('active','ended','terminated');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'process_type') THEN
    CREATE TYPE process_type AS ENUM ('civil','labor','criminal','family','administrative','other');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'process_status') THEN
    CREATE TYPE process_status AS ENUM ('won','lost','in_progress','pending');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM ('contract_expiring','contract_expired','process_deadline','process_urgent','payment_due','document_required','court_hearing','custom');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_priority') THEN
    CREATE TYPE notification_priority AS ENUM ('low','medium','high','urgent');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_type') THEN
    CREATE TYPE entity_type AS ENUM ('contract','process','document','task');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_type') THEN
    CREATE TYPE task_type AS ENUM ('deadline','hearing','document_preparation','filing','response','appeal','meeting','research','review','custom');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE task_priority AS ENUM ('low','medium','high','urgent');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('pending','in_progress','completed','cancelled','overdue');
  END IF;
END;
$$;

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
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner" on public.profiles
  for select using (id = auth.uid());
drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner" on public.profiles
  for insert with check (id = auth.uid());
drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create index if not exists profiles_email_idx on public.profiles(email);
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure set_updated_at();
drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change before update on public.profiles
  for each row execute procedure public.prevent_role_change();

-- Allow admins to gerenciar todos os perfis
drop policy if exists "Profiles manageable by admin" on public.profiles;
create policy "Profiles manageable by admin" on public.profiles
  for all
  using (
    exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role = 'admin'
    )
  );

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
drop policy if exists "Clients are visible to owner" on public.clients;
create policy "Clients are visible to owner" on public.clients
  for select using (user_id = auth.uid());
drop policy if exists "Clients are creatable by owner" on public.clients;
create policy "Clients are creatable by owner" on public.clients
  for insert with check (user_id = auth.uid());
drop policy if exists "Clients are updatable by owner" on public.clients;
create policy "Clients are updatable by owner" on public.clients
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Clients are deletable by owner" on public.clients;
create policy "Clients are deletable by owner" on public.clients
  for delete using (user_id = auth.uid());
create index if not exists clients_user_idx on public.clients(user_id);
drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at before update on public.clients
  for each row execute procedure set_updated_at();

drop policy if exists "Clients visible to admin" on public.clients;
create policy "Clients visible to admin" on public.clients
  for select using (
    exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role = 'admin'
    )
  );

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
drop policy if exists "Contracts visible to owner" on public.contracts;
create policy "Contracts visible to owner" on public.contracts
  for select using (user_id = auth.uid());
drop policy if exists "Contracts creatable by owner" on public.contracts;
create policy "Contracts creatable by owner" on public.contracts
  for insert with check (user_id = auth.uid());
drop policy if exists "Contracts updatable by owner" on public.contracts;
create policy "Contracts updatable by owner" on public.contracts
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Contracts deletable by owner" on public.contracts;
create policy "Contracts deletable by owner" on public.contracts
  for delete using (user_id = auth.uid());
create index if not exists contracts_user_idx on public.contracts(user_id);
create index if not exists contracts_client_idx on public.contracts(client_id);
drop trigger if exists contracts_set_updated_at on public.contracts;
create trigger contracts_set_updated_at before update on public.contracts
  for each row execute procedure set_updated_at();

drop policy if exists "Contracts visible to admin" on public.contracts;
create policy "Contracts visible to admin" on public.contracts
  for select using (
    exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role = 'admin'
    )
  );

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
drop policy if exists "Processes visible to owner" on public.processes;
create policy "Processes visible to owner" on public.processes
  for select using (user_id = auth.uid());
drop policy if exists "Processes creatable by owner" on public.processes;
create policy "Processes creatable by owner" on public.processes
  for insert with check (user_id = auth.uid());
drop policy if exists "Processes updatable by owner" on public.processes;
create policy "Processes updatable by owner" on public.processes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Processes deletable by owner" on public.processes;
create policy "Processes deletable by owner" on public.processes
  for delete using (user_id = auth.uid());
create index if not exists processes_user_idx on public.processes(user_id);
create index if not exists processes_client_idx on public.processes(client_id);
drop trigger if exists processes_set_updated_at on public.processes;
create trigger processes_set_updated_at before update on public.processes
  for each row execute procedure set_updated_at();

drop policy if exists "Processes visible to admin" on public.processes;
create policy "Processes visible to admin" on public.processes
  for select using (
    exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role = 'admin'
    )
  );

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
drop policy if exists "Tasks visible to owner" on public.tasks;
create policy "Tasks visible to owner" on public.tasks
  for select using (user_id = auth.uid());
drop policy if exists "Tasks creatable by owner" on public.tasks;
create policy "Tasks creatable by owner" on public.tasks
  for insert with check (user_id = auth.uid());
drop policy if exists "Tasks updatable by owner" on public.tasks;
create policy "Tasks updatable by owner" on public.tasks
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Tasks deletable by owner" on public.tasks;
create policy "Tasks deletable by owner" on public.tasks
  for delete using (user_id = auth.uid());
create index if not exists tasks_user_idx on public.tasks(user_id);
drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute procedure set_updated_at();

drop policy if exists "Tasks visible to admin" on public.tasks;
create policy "Tasks visible to admin" on public.tasks
  for select using (
    exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role = 'admin'
    )
  );

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
drop policy if exists "Notifications visible to owner" on public.notifications;
create policy "Notifications visible to owner" on public.notifications
  for select using (user_id = auth.uid());
drop policy if exists "Notifications creatable by owner" on public.notifications;
create policy "Notifications creatable by owner" on public.notifications
  for insert with check (user_id = auth.uid());
drop policy if exists "Notifications updatable by owner" on public.notifications;
create policy "Notifications updatable by owner" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Notifications deletable by owner" on public.notifications;
create policy "Notifications deletable by owner" on public.notifications
  for delete using (user_id = auth.uid());
create index if not exists notifications_user_idx on public.notifications(user_id);
drop trigger if exists notifications_set_updated_at on public.notifications;
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
drop policy if exists "Settings visible to owner" on public.notification_settings;
create policy "Settings visible to owner" on public.notification_settings
  for select using (user_id = auth.uid());
drop policy if exists "Settings creatable by owner" on public.notification_settings;
create policy "Settings creatable by owner" on public.notification_settings
  for insert with check (user_id = auth.uid());
drop policy if exists "Settings updatable by owner" on public.notification_settings;
create policy "Settings updatable by owner" on public.notification_settings
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Settings deletable by owner" on public.notification_settings;
create policy "Settings deletable by owner" on public.notification_settings
  for delete using (user_id = auth.uid());
create index if not exists notification_settings_user_idx on public.notification_settings(user_id);
drop trigger if exists notification_settings_set_updated_at on public.notification_settings;
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
drop policy if exists "Comments visible to owner" on public.comments;
create policy "Comments visible to owner" on public.comments
  for select using (user_id = auth.uid());
drop policy if exists "Comments creatable by owner" on public.comments;
create policy "Comments creatable by owner" on public.comments
  for insert with check (user_id = auth.uid());
drop policy if exists "Comments updatable by owner" on public.comments;
create policy "Comments updatable by owner" on public.comments
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Comments deletable by owner" on public.comments;
create policy "Comments deletable by owner" on public.comments
  for delete using (user_id = auth.uid());
create index if not exists comments_user_idx on public.comments(user_id);
drop trigger if exists comments_set_updated_at on public.comments;
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
drop policy if exists "CrossRefs visible to owner" on public.cross_references;
create policy "CrossRefs visible to owner" on public.cross_references
  for select using (user_id = auth.uid());
drop policy if exists "CrossRefs creatable by owner" on public.cross_references;
create policy "CrossRefs creatable by owner" on public.cross_references
  for insert with check (user_id = auth.uid());
drop policy if exists "CrossRefs updatable by owner" on public.cross_references;
create policy "CrossRefs updatable by owner" on public.cross_references
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "CrossRefs deletable by owner" on public.cross_references;
create policy "CrossRefs deletable by owner" on public.cross_references
  for delete using (user_id = auth.uid());
create index if not exists cross_references_user_idx on public.cross_references(user_id);
drop trigger if exists cross_references_set_updated_at on public.cross_references;
create trigger cross_references_set_updated_at before update on public.cross_references
  for each row execute procedure set_updated_at();

-- Tribunal Updates (Andamentos Processuais)
create table if not exists public.tribunal_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  process_number text not null,
  title text not null,
  description text not null,
  status text,
  tribunal text,
  vara text,
  update_date timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table public.tribunal_updates enable row level security;
create policy "Tribunal updates visible to owner" on public.tribunal_updates
  for select using (user_id = auth.uid());
create policy "Tribunal updates creatable by owner" on public.tribunal_updates
  for insert with check (user_id = auth.uid());
create policy "Tribunal updates updatable by owner" on public.tribunal_updates
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Tribunal updates deletable by owner" on public.tribunal_updates
  for delete using (user_id = auth.uid());
create index if not exists tribunal_updates_user_idx on public.tribunal_updates(user_id);
create index if not exists tribunal_updates_process_number_idx on public.tribunal_updates(process_number);
create index if not exists tribunal_updates_date_idx on public.tribunal_updates(update_date);
drop trigger if exists tribunal_updates_set_updated_at on public.tribunal_updates;
create trigger tribunal_updates_set_updated_at before update on public.tribunal_updates
  for each row execute procedure set_updated_at();

-- Tracked Process Numbers (números de processos rastreados)
create table if not exists public.tracked_process_numbers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  process_number text not null,
  created_at timestamp with time zone not null default now(),
  unique(user_id, process_number)
);
alter table public.tracked_process_numbers enable row level security;
drop policy if exists "Tracked numbers visible to owner" on public.tracked_process_numbers;
create policy "Tracked numbers visible to owner" on public.tracked_process_numbers
  for select using (user_id = auth.uid());
drop policy if exists "Tracked numbers creatable by owner" on public.tracked_process_numbers;
create policy "Tracked numbers creatable by owner" on public.tracked_process_numbers
  for insert with check (user_id = auth.uid());
drop policy if exists "Tracked numbers deletable by owner" on public.tracked_process_numbers;
create policy "Tracked numbers deletable by owner" on public.tracked_process_numbers
  for delete using (user_id = auth.uid());
create index if not exists tracked_process_numbers_user_idx on public.tracked_process_numbers(user_id);
create index if not exists tracked_process_numbers_process_idx on public.tracked_process_numbers(process_number);

-- Notes:
-- 1) Run this script in the Supabase SQL editor.
-- 2) Ensure authentication email confirmations are configured per your project needs.
-- 3) The app expects a 'profiles' row for each user; insert happens at sign-up.