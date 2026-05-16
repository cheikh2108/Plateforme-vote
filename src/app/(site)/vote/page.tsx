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
import { siteConfig } from "@/config/site";

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
        <p className="mt-2 text-sm text-muted-foreground">
          Revenez plus tard ou contactez l&apos;administration.
        </p>
      </div>
    );
  }

  const candidates = await getCandidates(election.id);
  const live = electionIsLive(election);

  if (!hasSupabase) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <PageHeader election={election} />
        <div className="mt-10">
          <VoteBallot
            electionId={election.id}
            candidates={candidates}
            initialHasVoted={false}
            votingOpen={live}
          />
        </div>
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
      <PageHeader election={election} />
      <div className="mt-10">
        <VoteBallot
          electionId={election.id}
          candidates={candidates}
          initialHasVoted={voted}
          votingOpen={live}
        />
      </div>
    </div>
  );
}

function PageHeader({ election }: { election: { title: string } }) {
  return (
    <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {siteConfig.shortName} · Bulletin anonyme
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{election.title}</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Votre vote est séparé de votre identité. Le compte sert uniquement à valider votre accès.
        </p>
      </div>
      <Link
        href="/candidats"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full shrink-0")}
      >
        Consulter les programmes
      </Link>
    </header>
  );
}
