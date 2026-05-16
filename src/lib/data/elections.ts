import { siteConfig } from "@/config/site";
import {
  demoCandidates,
  demoElection,
  demoStats,
  getDemoSchool,
} from "@/lib/demo-data";
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type {
  Candidate,
  Election,
  ElectionStats,
  School,
  UserRole,
} from "@/types/database";

export function electionIsLive(election: Election): boolean {
  const now = Date.now();
  const start = new Date(election.opens_at).getTime();
  const end = new Date(election.closes_at).getTime();
  return election.voting_open && now >= start && now <= end;
}

export async function getSchool(): Promise<School | null> {
  if (!hasSupabase) return getDemoSchool();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", siteConfig.schoolSlug)
    .maybeSingle();

  if (error || !data) return getDemoSchool();
  return normalizeSchool(data);
}

export async function getActiveElection(): Promise<Election | null> {
  if (!hasSupabase) return demoElection;

  const supabase = await createClient();
  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("slug", siteConfig.schoolSlug)
    .maybeSingle();

  if (!school) return demoElection;

  const { data, error } = await supabase
    .from("elections")
    .select("*")
    .eq("school_id", school.id)
    .order("closes_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return demoElection;
  return normalizeElection(data);
}

export async function getCandidates(
  electionId: string,
): Promise<Candidate[]> {
  if (!hasSupabase || electionId === demoElection.id) {
    return demoCandidates.sort((a, b) => a.sort_order - b.sort_order);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", electionId)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];
  return data.map(normalizeCandidate);
}

export async function getCandidateBySlug(
  electionId: string,
  slug: string,
): Promise<Candidate | null> {
  const list = await getCandidates(electionId);
  return list.find((c) => c.slug === slug) ?? null;
}

export async function getElectionStats(
  electionId: string,
): Promise<ElectionStats | null> {
  if (!hasSupabase || electionId === demoElection.id) {
    return demoStats;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("election_stats")
    .select("*")
    .eq("election_id", electionId)
    .maybeSingle();

  if (error || !data) {
    return { election_id: electionId, participation_count: 0, updated_at: new Date().toISOString() };
  }
  return data as ElectionStats;
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  if (!hasSupabase) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Utilise une fonction SECURITY DEFINER pour bypasser le RLS
  // et éviter la récursion dans profiles_admin_all.
  const { data, error } = await supabase.rpc("get_my_role");

  if (error || !data) {
    // Fallback : lecture directe si la fonction RPC n'existe pas encore
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    return (profile?.role as UserRole) ?? null;
  }

  return data as UserRole;
}

export async function userHasVoted(
  electionId: string,
): Promise<boolean> {
  if (!hasSupabase || electionId === demoElection.id) return false;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("vote_registry")
    .select("election_id")
    .eq("election_id", electionId)
    .eq("user_id", user.id)
    .maybeSingle();

  return Boolean(data);
}

/** Agrégation résultats — uniquement si publication ou mode démo */
export async function getResultsBreakdown(electionId: string): Promise<
  | { candidate_id: string; votes: number }[]
  | null
> {
  const election = await getActiveElection();
  if (!election || election.id !== electionId) return null;

  if (!hasSupabase || electionId === demoElection.id) {
    if (!demoElection.results_public) return null;
    return demoCandidates.map((c, i) => ({
      candidate_id: c.id,
      votes: [120, 95, 78][i] ?? 40,
    }));
  }

  const supabase = await createClient();

  if (!election.results_public) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") return null;
  }

  const { data, error } = await supabase
    .from("ballot_tally")
    .select("candidate_id, votes")
    .eq("election_id", electionId);

  if (error || !data) return null;

  return data.map((row) => ({
    candidate_id: row.candidate_id as string,
    votes: Number(row.votes),
  }));
}

function normalizeSchool(row: Record<string, unknown>): School {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    tagline: (row.tagline as string) ?? null,
    logo_url: (row.logo_url as string) ?? null,
    branding: (row.branding as Record<string, unknown>) ?? {},
  };
}

function normalizeElection(row: Record<string, unknown>): Election {
  return {
    id: row.id as string,
    school_id: row.school_id as string,
    title: row.title as string,
    description: (row.description as string) ?? null,
    opens_at: row.opens_at as string,
    closes_at: row.closes_at as string,
    voting_open: Boolean(row.voting_open),
    results_public: Boolean(row.results_public),
    eligible_email_suffix: row.eligible_email_suffix as string,
  };
}

function normalizeCandidate(row: Record<string, unknown>): Candidate {
  return {
    id: row.id as string,
    election_id: row.election_id as string,
    slug: row.slug as string,
    display_name: row.display_name as string,
    slogan: (row.slogan as string) ?? null,
    summary: (row.summary as string) ?? null,
    biography: (row.biography as string) ?? null,
    photo_url: (row.photo_url as string) ?? null,
    program_pdf_url: (row.program_pdf_url as string) ?? null,
    social_links: Array.isArray(row.social_links)
      ? (row.social_links as Candidate["social_links"])
      : [],
    team: Array.isArray(row.team) ? (row.team as Candidate["team"]) : [],
    promises: Array.isArray(row.promises)
      ? (row.promises as string[])
      : [],
    sort_order: Number(row.sort_order ?? 0),
  };
}
