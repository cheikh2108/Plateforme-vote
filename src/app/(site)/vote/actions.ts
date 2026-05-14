"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function castVoteAction(electionId: string, candidateId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("cast_vote", {
    p_election: electionId,
    p_candidate: candidateId,
  });

  if (error) {
    throw new Error(error.message || "Impossible de confirmer le bulletin.");
  }

  // Invalidate results cache so the new vote count is shown immediately
  revalidatePath("/resultats");
  
  return { success: true };
}
