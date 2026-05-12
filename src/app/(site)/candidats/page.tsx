import type { Metadata } from "next";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { getActiveElection, getCandidates } from "@/lib/data/elections";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Candidats",
  description: `Listes en lice — ${siteConfig.name}`,
};

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const election = await getActiveElection();
  const candidates = election ? await getCandidates(election.id) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Scrutin en cours
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Les candidatures officielles
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Chaque fiche est structurée pour une lecture rapide : programme, engagements et équipe. Les documents PDF
          peuvent être ajoutés par l’administration.
        </p>
      </header>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} />
        ))}
      </div>
      {candidates.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Aucun candidat publié pour le moment. Vérifiez la configuration de la plateforme ou les données de démo.
        </p>
      ) : null}
    </div>
  );
}
