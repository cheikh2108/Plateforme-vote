"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VOTE_ERROR_MESSAGES: Record<string, string> = {
  AUTH_REQUIRED: "Vous devez être connecté pour voter.",
  ELECTION_NOT_FOUND: "Cette élection n'existe pas.",
  DOMAIN_NOT_ALLOWED: "Votre adresse e-mail n'est pas autorisée à voter.",
  VOTING_UNAVAILABLE: "Le scrutin n'est pas ouvert en ce moment.",
  ALREADY_VOTED: "Vous avez déjà voté pour ce scrutin.",
  INVALID_CANDIDATE: "Ce candidat est invalide.",
};

export async function castVoteAction(electionId: string, candidateId: string) {
  if (!UUID_RE.test(electionId) || !UUID_RE.test(candidateId)) {
    throw new Error("Paramètres de vote invalides.");
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("cast_vote", {
    p_election: electionId,
    p_candidate: candidateId,
  });

  if (error) {
    const userMsg = VOTE_ERROR_MESSAGES[error.message] ?? "Impossible de confirmer le bulletin.";
    throw new Error(userMsg);
  }

  revalidatePath("/resultats");
  return { success: true };
}
