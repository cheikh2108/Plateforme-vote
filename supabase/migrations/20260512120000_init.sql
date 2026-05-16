-- Plateforme vote étudiant — schéma multi-tenant + anonymat du bulletin
-- À exécuter dans le SQL Editor Supabase ou via CLI.

create extension if not exists "pgcrypto";

-- Types
do $$ begin
  create type public.user_role as enum ('voter', 'admin');
exception
  when duplicate_object then null;
end $$;

-- Écoles (marque par tenant)
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  logo_url text,
  branding jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Profils liés à auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  school_id uuid references public.schools (id) on delete set null,
  role public.user_role not null default 'voter',
  created_at timestamptz not null default now()
);

-- Élections
create table if not exists public.elections (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  title text not null,
  description text,
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  voting_open boolean not null default false,
  results_public boolean not null default false,
  eligible_email_suffix text not null default '@estm.edu.sn',
  created_at timestamptz not null default now()
);

create index if not exists elections_school_id_idx on public.elections (school_id);

-- Candidats
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.elections (id) on delete cascade,
  slug text not null,
  display_name text not null,
  slogan text,
  summary text,
  biography text,
  photo_url text,
  program_pdf_url text,
  social_links jsonb not null default '[]'::jsonb,
  team jsonb not null default '[]'::jsonb,
  promises jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (election_id, slug)
);

create index if not exists candidates_election_id_idx on public.candidates (election_id);

-- Registre : preuve qu’un étudiant a voté (sans lien avec le candidat)
create table if not exists public.vote_registry (
  election_id uuid not null references public.elections (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  voted_at timestamptz not null default now(),
  primary key (election_id, user_id)
);

-- Bulletins anonymes (pas de user_id)
create table if not exists public.ballots (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.elections (id) on delete cascade,
  candidate_id uuid not null references public.candidates (id) on delete cascade,
  cast_at timestamptz not null default now()
);

create index if not exists ballots_election_id_idx on public.ballots (election_id);

-- Stats participation (mis à jour avec le vote)
create table if not exists public.election_stats (
  election_id uuid primary key references public.elections (id) on delete cascade,
  participation_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- Trigger profil à l’inscription
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  s_id uuid;
begin
  -- Match school by eligible_email_suffix first, then fall back to oldest school
  select e.school_id into s_id
  from public.elections e
  where lower(new.email) like ('%' || lower(e.eligible_email_suffix))
  order by e.created_at asc
  limit 1;

  if s_id is null then
    select id into s_id from public.schools order by created_at asc limit 1;
  end if;

  insert into public.profiles (id, school_id, role)
  values (new.id, s_id, 'voter')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- Vote atomique + anonyme
create or replace function public.cast_vote (p_election uuid, p_candidate uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_suffix text;
begin
  select email into v_email from auth.users where id = auth.uid();
  if v_email is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select eligible_email_suffix into v_suffix from public.elections where id = p_election;
  if v_suffix is null then
    raise exception 'ELECTION_NOT_FOUND';
  end if;

  if lower(right(lower(trim(v_email)), length(v_suffix))) <> lower(v_suffix) then
    raise exception 'DOMAIN_NOT_ALLOWED';
  end if;

  if not exists (
    select 1 from public.elections e
    where e.id = p_election
      and e.voting_open = true
      and now() >= e.opens_at
      and now() <= e.closes_at
  ) then
    raise exception 'VOTING_UNAVAILABLE';
  end if;

  if exists (
    select 1 from public.vote_registry vr
    where vr.election_id = p_election and vr.user_id = auth.uid()
  ) then
    raise exception 'ALREADY_VOTED';
  end if;

  if not exists (
    select 1 from public.candidates c
    where c.id = p_candidate and c.election_id = p_election
  ) then
    raise exception 'INVALID_CANDIDATE';
  end if;

  insert into public.vote_registry (election_id, user_id)
  values (p_election, auth.uid());

  insert into public.ballots (election_id, candidate_id)
  values (p_election, p_candidate);

  insert into public.election_stats (election_id, participation_count)
  values (p_election, 1)
  on conflict (election_id) do update
    set participation_count = public.election_stats.participation_count + 1,
        updated_at = now();
end;
$$;

grant execute on function public.cast_vote (uuid, uuid) to authenticated;

-- RLS
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.elections enable row level security;
alter table public.candidates enable row level security;
alter table public.vote_registry enable row level security;
alter table public.ballots enable row level security;
alter table public.election_stats enable row level security;

-- Schools : lecture publique
drop policy if exists "schools_select_all" on public.schools;
create policy "schools_select_all" on public.schools for select using (true);

-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Elections
drop policy if exists "elections_select_all" on public.elections;
create policy "elections_select_all" on public.elections for select using (true);

drop policy if exists "elections_admin_insert" on public.elections;
create policy "elections_admin_insert" on public.elections for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "elections_admin_update" on public.elections;
create policy "elections_admin_update" on public.elections for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Candidats : lecture pour tous
drop policy if exists "candidates_select_all" on public.candidates;
create policy "candidates_select_all" on public.candidates for select using (true);

drop policy if exists "candidates_admin_write" on public.candidates;
create policy "candidates_admin_write" on public.candidates for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- vote_registry : uniquement sa ligne
drop policy if exists "vote_registry_select_own" on public.vote_registry;
create policy "vote_registry_select_own" on public.vote_registry for select using (auth.uid() = user_id);

-- Pas d’insert direct utilisateur : réservé à cast_vote (security definer)

-- Bulletins : résultats détaillés si publication OU admin
drop policy if exists "ballots_select_results" on public.ballots;
create policy "ballots_select_results" on public.ballots for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  or exists (
    select 1 from public.elections e
    where e.id = ballots.election_id and e.results_public = true
  )
);

-- Stats participation : visibles pendant et après le scrutin
drop policy if exists "election_stats_select_all" on public.election_stats;
create policy "election_stats_select_all" on public.election_stats for select using (true);

-- Vue agrégée des résultats (remplace le comptage côté application)
create or replace view public.ballot_tally as
  select election_id, candidate_id, count(*) as votes
  from public.ballots
  group by election_id, candidate_id;

-- Données initiales (première école — adapter le branding en prod)
insert into public.schools (slug, name, tagline, branding)
values (
  'estm',
  'ESTM',
  'Excellence académique & gouvernance étudiante',
  jsonb_build_object(
    'accent', '#a67c52',
    'accentMuted', '#8b6914',
    'surface', '#faf8f5',
    'heroStatement', 'Une plateforme électorale institutionnelle pour votre campus.'
  )
)
on conflict (slug) do nothing;

-- Élection exemple (dates à ajuster)
insert into public.elections (
  school_id,
  title,
  description,
  opens_at,
  closes_at,
  voting_open,
  results_public,
  eligible_email_suffix
)
select
  s.id,
  'Élection du bureau des étudiants',
  'Votez pour représenter votre promotion. Anonymat garanti, une voix, une fois.',
  now() - interval '1 day',
  now() + interval '14 days',
  true,
  false,
  '@estm.edu.sn'
from public.schools s
where s.slug = 'estm'
  and not exists (
    select 1 from public.elections e where e.school_id = s.id
  );

-- Candidats fictifs (si table vide pour cette élection)
insert into public.candidates (
  election_id, slug, display_name, slogan, summary, biography,
  photo_url, promises, sort_order
)
select
  e.id,
  v.slug,
  v.display_name,
  v.slogan,
  v.summary,
  v.biography,
  v.photo_url,
  v.promises,
  v.sort_order::integer
from public.elections e
cross join (values
  (
    'aminata-diallo',
    'Aminata Diallo',
    'Ensemble, construire',
    'Une liste tournée vers l’écoute et la transparence.',
    'Ingénierie & engagement associatif. Engagée depuis trois ans dans les instances étudiantes, Aminata porte une vision de proximité et de résultats mesurables.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    '["Wi‑Fi campus renforcé","Médiation étudiants–administration","Événements inter-promotions"]'::jsonb,
    1
  ),
  (
    'karim-faye',
    'Karim Faye',
    'Cap sur l’action',
    'Des projets concrets, rapidement.',
    'Priorité aux infrastructures et à la vie quotidienne sur le campus. Karim met l’accent sur l’exécution : budgets suivis, délais tenus, reporting accessible à tous.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    '["Salles de travail étendues","Bus étudiants renforcés","Sport & bien‑être"]'::jsonb,
    2
  ),
  (
    'salma-niang',
    'Salma Niang',
    'Voix & diversité',
    'Représenter toutes les voix.',
    'Inclusion, équité et communication ouverte. Pour une instance qui reflète la diversité des parcours et facilite l’accès à l’information.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
    '["Communication multilingue","Mentorat entre promotions","Égalité des chances"]'::jsonb,
    3
  )
) as v(slug, display_name, slogan, summary, biography, photo_url, promises, sort_order)
where e.school_id = (select id from public.schools where slug = 'estm' limit 1)
  and not exists (
    select 1 from public.candidates c where c.election_id = e.id
  );

-- Promouvoir un administrateur après première connexion Auth :
-- update public.profiles set role = 'admin'
-- where id = '<uuid-auth-users>';
