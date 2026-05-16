import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageOff, CheckCircle2, Users2, FileText } from "lucide-react";
import { getActiveElection, getCandidates, getResultsBreakdown } from "@/lib/data/elections";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  const election = await getActiveElection();
  const candidates = election ? await getCandidates(election.id) : [];
  const breakdown = election ? await getResultsBreakdown(election.id) : null;

  const totalVotes = breakdown?.reduce((acc, r) => acc + r.votes, 0) ?? 0;

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Gestion des fiches
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Candidats</h1>
          <p className="text-sm text-muted-foreground">
            {candidates.length} liste{candidates.length > 1 ? "s" : ""} enregistrée{candidates.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/candidats"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full gap-1.5")}
        >
          <ExternalLink className="size-3.5" />
          Voir la vitrine
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border">
          <p className="text-sm font-medium">Aucun candidat enregistré</p>
          <p className="text-xs text-muted-foreground">Ajoutez des candidats dans Supabase → table candidates.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {candidates.map((c, i) => {
            const votes = breakdown?.find((b) => b.candidate_id === c.id)?.votes ?? 0;
            const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
              >
                {/* Bande top : rang + score */}
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                      i === 0 && votes > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                    )}>
                      {c.sort_order || i + 1}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Liste n°{c.sort_order || i + 1}
                    </span>
                  </div>
                  {totalVotes > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground tabular-nums">{votes} voix</span>
                      <span className="text-sm font-semibold tabular-nums">{pct.toFixed(1)}%</span>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Corps */}
                <div className="flex flex-col gap-5 p-5 sm:flex-row">
                  {/* Photo */}
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {c.photo_url ? (
                      <Image
                        src={c.photo_url}
                        alt={c.display_name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="size-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight">{c.display_name}</h3>
                      {c.slogan && (
                        <p className="mt-0.5 text-sm italic text-muted-foreground">&ldquo;{c.slogan}&rdquo;</p>
                      )}
                    </div>

                    {c.summary && (
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {c.summary}
                      </p>
                    )}

                    {/* Promesses */}
                    {c.promises.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <CheckCircle2 className="size-3.5" />
                          Engagements
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {c.promises.map((p) => (
                            <li
                              key={p}
                              className="rounded-full border border-border bg-muted/40 px-3 py-0.5 text-xs text-foreground"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Colonne droite : équipe + liens */}
                  <div className="flex flex-col gap-3 sm:w-44 sm:shrink-0">
                    {/* Équipe */}
                    {c.team.length > 0 && (
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <Users2 className="size-3" />
                          Équipe
                        </p>
                        <ul className="space-y-1.5">
                          {c.team.map((m) => (
                            <li key={m.name} className="text-xs">
                              <span className="font-medium text-foreground">{m.name}</span>
                              <span className="ml-1 text-muted-foreground">· {m.role}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* PDF programme */}
                    {c.program_pdf_url && (
                      <a
                        href={c.program_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs font-medium text-foreground hover:border-foreground/30 transition"
                      >
                        <FileText className="size-3.5 shrink-0" />
                        Programme PDF
                        <ExternalLink className="ml-auto size-3 text-muted-foreground" />
                      </a>
                    )}

                    {/* Lien fiche publique */}
                    <Link
                      href={`/candidats/${c.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      Fiche publique
                    </Link>
                  </div>
                </div>

                {/* Biographie (dépliée) */}
                {c.biography && (
                  <details className="border-t border-border">
                    <summary className="cursor-pointer px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground select-none">
                      Biographie complète
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {c.biography}
                    </p>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Note gestion */}
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Modifier les candidats :</span>{" "}
        Rendez-vous dans Supabase → Table Editor → table <code className="rounded bg-muted px-1 py-0.5">candidates</code>.
        Les modifications sont reflétées immédiatement sans redéploiement.
      </div>
    </div>
  );
}
