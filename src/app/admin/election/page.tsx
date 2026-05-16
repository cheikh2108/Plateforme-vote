import { Calendar, Clock, Mail, Settings2, ShieldCheck, ToggleRight, ExternalLink } from "lucide-react";
import { getActiveElection, getElectionStats } from "@/lib/data/elections";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminElectionPage() {
  const election = await getActiveElection();
  const stats = election ? await getElectionStats(election.id) : null;

  if (!election) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border">
        <p className="text-sm font-medium">Aucune élection configurée</p>
        <p className="text-xs text-muted-foreground">Créez une élection dans Supabase.</p>
      </div>
    );
  }

  const now = Date.now();
  const opensAt = new Date(election.opens_at).getTime();
  const closesAt = new Date(election.closes_at).getTime();
  const totalDuration = closesAt - opensAt;
  const elapsed = Math.max(0, Math.min(now - opensAt, totalDuration));
  const progressPct = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;

  const phase: "before" | "during" | "after" =
    now < opensAt ? "before" : now > closesAt ? "after" : "during";

  const msLeft = closesAt - now;
  const hoursLeft = Math.max(0, Math.floor(msLeft / 3600000));
  const daysLeft = Math.floor(hoursLeft / 24);
  const timeLeftStr =
    phase === "after"
      ? "Terminé"
      : phase === "before"
      ? `Commence le ${formatDateShort(election.opens_at)}`
      : daysLeft > 0
      ? `${daysLeft}j ${hoursLeft % 24}h restants`
      : `${hoursLeft}h ${Math.floor((msLeft % 3600000) / 60000)}m restants`;

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Paramètres de scrutin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Élection</h1>
        <p className="text-sm text-muted-foreground">Configuration et état du scrutin en cours</p>
      </div>

      {/* Carte principale */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">

        {/* Bandeau statut */}
        <div className={cn(
          "flex items-center justify-between gap-3 border-b border-border px-6 py-3",
          phase === "during" && election.voting_open
            ? "bg-green-50"
            : phase === "after"
            ? "bg-muted/40"
            : "bg-yellow-50",
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              "h-2 w-2 rounded-full",
              phase === "during" && election.voting_open
                ? "bg-green-500 animate-pulse"
                : phase === "after"
                ? "bg-muted-foreground"
                : "bg-yellow-500",
            )} />
            <span className={cn(
              "text-xs font-semibold",
              phase === "during" && election.voting_open
                ? "text-green-700"
                : phase === "after"
                ? "text-muted-foreground"
                : "text-yellow-700",
            )}>
              {phase === "during" && election.voting_open
                ? "Scrutin actif — acceptation des bulletins en cours"
                : phase === "during" && !election.voting_open
                ? "Fenêtre horaire ouverte mais vote suspendu par l'admin"
                : phase === "after"
                ? "Scrutin clôturé"
                : "Scrutin programmé — pas encore ouvert"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{timeLeftStr}</span>
        </div>

        {/* Infos élection */}
        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Titre de l&apos;élection</p>
            <p className="text-lg font-semibold">{election.title}</p>
            {election.description && (
              <p className="mt-1 text-sm text-muted-foreground">{election.description}</p>
            )}
          </div>

          {/* Timeline visuelle */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Calendrier
            </p>
            <div className="relative rounded-xl bg-muted/40 p-4">
              <div className="flex items-start justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">Ouverture</p>
                  <p className="text-muted-foreground">{formatDate(election.opens_at)}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="font-semibold text-foreground">Clôture</p>
                  <p className="text-muted-foreground">{formatDate(election.closes_at)}</p>
                </div>
              </div>
              {/* Barre de progression */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    phase === "after"
                      ? "bg-muted-foreground"
                      : "bg-foreground",
                  )}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                <span>Début</span>
                {phase === "during" && (
                  <span className="font-medium text-foreground">
                    {Math.round(progressPct)}% écoulé
                  </span>
                )}
                <span>Fin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille infos techniques */}
      <div className="grid gap-4 sm:grid-cols-2">

        <InfoCard
          icon={<Mail className="size-4" />}
          title="Domaine email autorisé"
          value={election.eligible_email_suffix}
          description="Seuls les comptes avec ce suffixe peuvent voter."
        />

        <InfoCard
          icon={<ShieldCheck className="size-4" />}
          title="Identifiant élection"
          value={<code className="text-xs font-mono break-all">{election.id}</code>}
          description="Référence unique pour la base de données."
        />

        <InfoCard
          icon={<ToggleRight className="size-4" />}
          title="État du vote"
          value={
            <span className={cn(
              "text-sm font-semibold",
              election.voting_open ? "text-green-600" : "text-muted-foreground",
            )}>
              {election.voting_open ? "Ouvert" : "Fermé"}
            </span>
          }
          description="Contrôlable via les interrupteurs ci-dessous."
        />

        <InfoCard
          icon={<Settings2 className="size-4" />}
          title="Publication résultats"
          value={
            <span className={cn(
              "text-sm font-semibold",
              election.results_public ? "text-green-600" : "text-muted-foreground",
            )}>
              {election.results_public ? "Publique" : "Restreinte aux admins"}
            </span>
          }
          description="Visible sur la page /resultats."
        />

        <InfoCard
          icon={<Calendar className="size-4" />}
          title="Durée totale"
          value={(() => {
            const ms = closesAt - opensAt;
            const d = Math.floor(ms / 86400000);
            const h = Math.floor((ms % 86400000) / 3600000);
            return `${d > 0 ? `${d}j ` : ""}${h}h`;
          })()}
          description="Fenêtre horaire configurée."
        />

        <InfoCard
          icon={<Clock className="size-4" />}
          title="Participation"
          value={
            <span className="text-sm font-semibold">{stats?.participation_count ?? 0} votes</span>
          }
          description={`Mis à jour le ${new Date(stats?.updated_at ?? Date.now()).toLocaleString("fr-FR")}`}
        />
      </div>

      {/* Contrôles */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Contrôles en direct</h2>
        <AdminToolbar votingOpen={election.voting_open} resultsPublic={election.results_public} />
      </div>

      {/* Note Supabase */}
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
        <span>
          Pour modifier les dates, le titre ou le domaine email, rendez-vous dans{" "}
          <strong className="text-foreground">Supabase → Table Editor → elections</strong>.
          Les changements sont appliqués immédiatement.
        </span>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{title}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
