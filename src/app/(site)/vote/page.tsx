import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VoteBallot } from "@/components/vote/vote-ballot";
import { hasSupabase } from "@/lib/env";
import {
  electionIsLive,
  getActiveElection,
  getCandidates,
  userHasVoted,
} from "@/lib/data/elections";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vote sécurisé",
};

export const dynamic = "force-dynamic";

export default async function VotePage() {
  const election = await getActiveElection();

  if (!election) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="text-lg font-semibold">Aucune élection configurée</p>
      </div>
    );
  }

  const candidates = await getCandidates(election.id);
  const live = electionIsLive(election);

  if (!hasSupabase) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <header className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Mode hors ligne
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Vote sécurisé</h1>
          <p className="text-muted-foreground">
            La plateforme n’est pas encore reliée au service d’authentification. Activez la configuration pour voter.
          </p>
        </header>
        <VoteBallot
          electionId={election.id}
          candidates={candidates}
          initialHasVoted={false}
          votingOpen={live}
        />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/vote");
  }

  const voted = await userHasVoted(election.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="mb-12 flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Bulletin anonyme
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">{election.title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Votre choix est séparé de votre identité. Le compte utilisé sert uniquement à valider votre accès.
          </p>
        </div>
        <Link
          href="/candidats"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
        >
          Consulter les programmes
        </Link>
      </header>

      <VoteBallot
        electionId={election.id}
        candidates={candidates}
        initialHasVoted={voted}
        votingOpen={live}
      />
    </div>
  );
}
