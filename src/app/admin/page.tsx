import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Users, Vote, Award, Clock, BarChart3, ChevronRight } from "lucide-react";
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
import { ResultsChart } from "@/components/admin/results-chart";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function formatDuration(ms: number): string {
  if (ms <= 0) return "Clôturé";
  const h = Math.floor(ms / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}j ${h % 24}h restants`;
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m restants`;
}

export default async function AdminHomePage() {
  if (!hasSupabase) redirect("/");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login?next=/admin");

  const election = await getActiveElection();
  if (!election) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border">
        <p className="text-sm font-medium text-foreground">Aucune élection configurée</p>
        <p className="text-xs text-muted-foreground">Créez une élection dans votre base de données Supabase.</p>
      </div>
    );
  }

  const [candidates, stats, breakdown] = await Promise.all([
    getCandidates(election.id),
    getElectionStats(election.id),
    getResultsBreakdown(election.id),
  ]);

  const totalVotes = breakdown?.reduce((acc, r) => acc + r.votes, 0) ?? 0;
  const participation = stats?.participation_count ?? 0;
  const now = Date.now();
  const closesAt = new Date(election.closes_at).getTime();
  const opensAt = new Date(election.opens_at).getTime();
  const msLeft = closesAt - now;
  const isLive = election.voting_open && now >= opensAt && now <= closesAt;
  const isClosed = now > closesAt;

  const ranked = (breakdown ?? []).length > 0
    ? candidates
        .map((c) => ({
          ...c,
          votes: breakdown!.find((b) => b.candidate_id === c.id)?.votes ?? 0,
        }))
        .sort((a, b) => b.votes - a.votes)
    : candidates.map((c) => ({ ...c, votes: 0 }));

  const winner = ranked[0];

  return (
    <div className="space-y-7">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              isLive
                ? "bg-green-100 text-green-700"
                : isClosed
                ? "bg-muted text-muted-foreground"
                : "bg-yellow-100 text-yellow-700",
            )}>
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                isLive ? "bg-green-500 animate-pulse" : isClosed ? "bg-muted-foreground" : "bg-yellow-500",
              )} />
              {isLive ? "Scrutin ouvert" : isClosed ? "Scrutin clôturé" : "Scrutin en attente"}
            </span>
            {!isClosed && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formatDuration(msLeft)}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{election.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(election.opens_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
            {" → "}
            {new Date(election.closes_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/resultats"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full gap-1.5")}
          >
            <ExternalLink className="size-3.5" />
            Page publique
          </Link>
          <ExportResultsButton
            electionTitle={election.title}
            candidates={candidates}
            breakdown={breakdown ?? []}
            participation={participation}
          />
        </div>
      </div>

      {/* ── Contrôles ──────────────────────────────────────────── */}
      <AdminToolbar votingOpen={election.voting_open} resultsPublic={election.results_public} />

      {/* ── KPIs ───────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Participation"
          value={participation}
          sub="électeurs ayant voté"
          icon={<Users className="size-4" />}
          accent={participation > 0}
        />
        <KpiCard
          label="Bulletins comptés"
          value={totalVotes}
          sub="bulletins anonymes dépouillés"
          icon={<Vote className="size-4" />}
        />
        <KpiCard
          label="Candidatures"
          value={candidates.length}
          sub="listes déposées"
          icon={<BarChart3 className="size-4" />}
        />
      </div>

      {/* ── Corps : classement + graphique ─────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Classement détaillé */}
        <div className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold">Classement</h2>
            {totalVotes === 0 && (
              <span className="text-xs text-muted-foreground">Aucun vote enregistré</span>
            )}
          </div>
          <div className="divide-y divide-border">
            {ranked.map((c, i) => {
              const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
              const maxVotes = ranked[0]?.votes || 1;
              const barPct = maxVotes > 0 ? (c.votes / maxVotes) * 100 : 0;
              const isFirst = i === 0 && c.votes > 0;
              return (
                <div key={c.id} className="flex items-center gap-4 px-6 py-4">
                  {/* Rang */}
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isFirst
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground",
                  )}>
                    {i + 1}
                  </span>

                  {/* Nom + barre */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {c.display_name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="tabular-nums text-xs text-muted-foreground">
                          {c.votes} voix
                        </span>
                        <span className="w-10 text-right text-xs font-semibold tabular-nums">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isFirst ? "bg-foreground" : "bg-muted-foreground/50",
                        )}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    {c.slogan && (
                      <p className="truncate text-[11px] text-muted-foreground">{c.slogan}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panneau droit : graphique + gagnant */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          {/* Graphique recharts */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">Répartition</h2>
            <ResultsChart candidates={ranked} totalVotes={totalVotes} />
          </div>

          {/* Leader */}
          {winner && winner.votes > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                <Award className="size-3.5" />
                En tête
              </div>
              <p className="text-xl font-semibold leading-tight">{winner.display_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{winner.slogan}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tabular-nums">
                  {totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 100) : 0}%
                </span>
                <span className="text-sm text-muted-foreground">des voix</span>
              </div>
            </div>
          )}

          {/* Lien vers détail candidats */}
          <Link
            href="/admin/candidats"
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground shadow-sm transition hover:border-foreground/30"
          >
            Gérer les candidatures
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, icon, accent = false,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl border p-5 shadow-sm",
      accent ? "border-foreground/20 bg-foreground text-background" : "border-border bg-card",
    )}>
      <div className="flex items-center justify-between">
        <p className={cn("text-sm font-medium", accent ? "text-background/70" : "text-muted-foreground")}>
          {label}
        </p>
        <span className={accent ? "text-background/60" : "text-muted-foreground"}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className={cn("mt-1 text-xs", accent ? "text-background/60" : "text-muted-foreground")}>
        {sub}
      </p>
    </div>
  );
}
