-- Fonction sécurisée pour lire le rôle de l'utilisateur courant.
-- SECURITY DEFINER = s'exécute avec les droits du créateur (superuser),
-- bypass le RLS → plus de problème de récursion ou de politique bloquante.
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role::text
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

-- Tout utilisateur authentifié peut appeler cette fonction
grant execute on function public.get_my_role() to authenticated;
grant execute on function public.get_my_role() to anon;
