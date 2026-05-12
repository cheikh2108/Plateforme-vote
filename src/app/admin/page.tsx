import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getActiveElection,
  getCandidates,
  getElectionStats,
  getResultsBreakdown,
} from "@/lib/data/elections";
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { ExportResultsButton } from "@/components/admin/export-results-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  if (!hasSupabase) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/admin");

  const election = await getActiveElection();
  if (!election) {
    return <p className="text-sm text-muted-foreground">Aucune élection trouvée.</p>;
  }

  const [candidates, stats, breakdown] = await Promise.all([
    getCandidates(election.id),
    getElectionStats(election.id),
    getResultsBreakdown(election.id),
  ]);

  const totalVotes =
    breakdown?.reduce((acc, row) => acc + row.votes, 0) ?? 0;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Pilotage
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Synthèse électorale</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{election.title}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/resultats"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
          >
            Voir la page publique
          </Link>
          <ExportResultsButton
            electionTitle={election.title}
            candidates={candidates}
            breakdown={breakdown ?? []}
            participation={stats?.participation_count ?? 0}
          />
        </div>
      </header>

      <AdminToolbar
        votingOpen={election.voting_open}
        resultsPublic={election.results_public}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">
              {stats?.participation_count ?? 0}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Basée sur le registre anonymisé (vote_registry).
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Bulletins dépouillés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">{totalVotes}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Agrégation issue des bulletins anonymes.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Listes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">{candidates.length}</p>
            <p className="mt-2 text-xs text-muted-foreground">Fiches publiées sur la vitrine.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
