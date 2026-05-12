"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Candidate, Election } from "@/types/database";
import { useElectionParticipation } from "@/hooks/use-election-stats";

type Props = {
  election: Election;
  candidates: Candidate[];
  participation: number;
  breakdown: { candidate_id: string; votes: number }[] | null;
};

export function ResultsView({
  election,
  candidates,
  participation,
  breakdown,
}: Props) {
  const liveParticipation = useElectionParticipation(election.id, participation);

  const chartData =
    breakdown?.map((row) => {
      const name =
        candidates.find((c) => c.id === row.candidate_id)?.display_name ?? "Liste";
      return { name, votes: row.votes };
    }) ?? [];

  const totalVotes = chartData.reduce((acc, row) => acc + row.votes, 0);

  return (
    <div className="space-y-14">
      <section className="grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-sm lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Indicateurs publics
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">Participation observée</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Pendant le scrutin, seuls les agrégats sont diffusés — aucun résultat détaillé ni classement n’est visible tant
            que l’administration n’a pas autorisé la publication complète.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-muted/40 p-8"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Voix enregistrées
          </p>
          <p className="mt-4 text-5xl font-semibold tracking-tight tabular-nums">
            {liveParticipation}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Mis à jour en temps réel lorsque le suivi live est activé sur la plateforme.
          </p>
        </motion.div>
      </section>

      {breakdown && breakdown.length > 0 ? (
        <section className="space-y-8">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Résultats officiels
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Synthèse du scrutin</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Visualisation sobre — proportions fondées sur les bulletins anonymisés après clôture et publication.
            </p>
          </header>

          <div className="h-[420px] rounded-3xl border border-border bg-card p-6 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
                <CartesianGrid strokeDasharray="4 8" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(166,124,82,0.08)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    borderColor: "var(--border)",
                    background: "var(--popover)",
                  }}
                />
                <Bar dataKey="votes" fill="#a67c52" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {chartData.map((row, index) => {
              const pct = totalVotes ? Math.round((row.votes / totalVotes) * 1000) / 10 : 0;
              return (
                <motion.div
                  key={row.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-border bg-muted/40 p-6"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {row.name}
                  </p>
                  <p className="mt-4 text-4xl font-semibold tracking-tight">{pct}%</p>
                  <p className="mt-2 text-sm text-muted-foreground">{row.votes} bulletins</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <p className="text-lg font-semibold tracking-tight">Résultats détaillés masqués</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Le classement et les pourcentages seront affichés lorsque l&apos;administration autorisera la publication des
            résultats après clôture officielle.
          </p>
        </section>
      )}
    </div>
  );
}
