import type { Metadata } from "next";
import { ResultsView } from "@/components/results/results-view";
import {
  getActiveElection,
  getCandidates,
  getElectionStats,
  getResultsBreakdown,
} from "@/lib/data/elections";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Participation & résultats",
  description: `Indicateurs agrégés — ${siteConfig.name}`,
};

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const election = await getActiveElection();

  if (!election) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="text-muted-foreground">Aucune élection configurée.</p>
      </div>
    );
  }

  const [candidates, stats, breakdown] = await Promise.all([
    getCandidates(election.id),
    getElectionStats(election.id),
    getResultsBreakdown(election.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-12 max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Transparence contrôlée
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Participation & résultats
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {election.title} — les données détaillées respectent le calendrier de publication défini par votre
          institution.
        </p>
      </header>

      <ResultsView
        election={election}
        candidates={candidates}
        participation={stats?.participation_count ?? 0}
        breakdown={breakdown}
      />
    </div>
  );
}
