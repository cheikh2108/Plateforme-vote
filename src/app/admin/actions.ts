"use server";

import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site";
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function assertAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("AUTH_REQUIRED");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("FORBIDDEN");
}

async function getScopedElectionId(supabase: SupabaseClient): Promise<string | null> {
  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("slug", siteConfig.schoolSlug)
    .maybeSingle();
  if (!school) return null;

  const { data: election } = await supabase
    .from("elections")
    .select("id")
    .eq("school_id", school.id)
    .order("closes_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return election?.id ?? null;
}

export async function setVotingOpen(open: boolean) {
  if (!hasSupabase) return;
  const supabase = await createClient();
  await assertAdmin(supabase);
  const electionId = await getScopedElectionId(supabase);
  if (!electionId) return;

  await supabase.from("elections").update({ voting_open: open }).eq("id", electionId);

  revalidatePath("/vote");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function setResultsPublic(publicResults: boolean) {
  if (!hasSupabase) return;
  const supabase = await createClient();
  await assertAdmin(supabase);
  const electionId = await getScopedElectionId(supabase);
  if (!electionId) return;

  await supabase
    .from("elections")
    .update({ results_public: publicResults })
    .eq("id", electionId);

  revalidatePath("/resultats");
  revalidatePath("/admin");
}
