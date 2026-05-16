"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

/* ESTM blue palette — darkest = winner, progressively lighter */
const BAR_COLORS = [
  "oklch(0.37 0.130 264)",
  "oklch(0.48 0.115 264)",
  "oklch(0.58 0.098 264)",
  "oklch(0.68 0.075 264)",
  "oklch(0.77 0.050 264)",
];

export function ResultsView({
  election,
  candidates,
  participation,
  breakdown,
}: Props) {
  const liveParticipation = useElectionParticipation(election.id, participation);

  const chartData =
    breakdown
      ?.map((row) => {
        const name =
          candidates.find((c) => c.id === row.candidate_id)?.display_name ?? "Liste";
        return { name, votes: row.votes };
      })
      .sort((a, b) => b.votes - a.votes) ?? [];

  const totalVotes = chartData.reduce((acc, row) => acc + row.votes, 0);
  const winner = chartData[0];

  return (
    <div className="space-y-14">
      {/* ── Participation ──────────────────────────────────────────── */}
      <section className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border shadow-sm lg:grid-cols-2">
        <div className="space-y-4 bg-card p-8 lg:p-10">
          <span className="editorial-rule" />
          <h2 className="text-3xl font-light leading-tight tracking-tight">
            Participation
            <br />
            <span className="font-semibold">observée.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Pendant le scrutin, seuls les agrégats sont diffusés — aucun résultat ni classement visible tant que l&apos;administration n&apos;a pas autorisé la publication.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between bg-estm-blue p-8 text-white lg:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
            Voix enregistrées
          </p>
          <p className="mt-6 text-7xl font-light tabular-nums leading-none tracking-tight">
            {liveParticipation}
          </p>
          <p className="mt-6 text-xs text-white/40">
            Mis à jour en temps réel · données agrégées anonymisées
          </p>
        </motion.div>
      </section>

      {/* ── Résultats ──────────────────────────────────────────────── */}
      {breakdown && breakdown.length > 0 ? (
        <section className="space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="editorial-rule" />
              <h2 className="text-4xl font-light leading-tight tracking-tight">
                Synthèse du
                <br />
                <span className="font-semibold">scrutin.</span>
              </h2>
            </div>
            {winner && (
              <div className="flex items-center gap-4 rounded-2xl border border-estm-blue/20 bg-estm-blue-light px-5 py-3.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-estm-blue">
                  En tête
                </span>
                <span className="text-sm font-semibold text-estm-blue">{winner.name}</span>
                <span className="ml-auto text-sm font-light tabular-nums text-estm-blue">
                  {totalVotes ? Math.round((winner.votes / totalVotes) * 1000) / 10 : 0}%
                </span>
              </div>
            )}
          </div>

          {/* Graphique */}
          <div className="h-[380px] overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--estm-blue-light)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    borderColor: "var(--border)",
                    background: "var(--popover)",
                    fontSize: "13px",
                  }}
                  formatter={(value) => [`${value} bulletins`, "Voix"]}
                />
                <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cartes résultats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chartData.map((row, index) => {
              const pct = totalVotes ? Math.round((row.votes / totalVotes) * 1000) / 10 : 0;
              const isLeader = index === 0;
              return (
                <motion.div
                  key={row.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    isLeader
                      ? "flex flex-col gap-4 rounded-2xl bg-estm-blue p-6 text-white"
                      : "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isLeader ? "text-white/50" : "text-muted-foreground"}`}>
                      {row.name}
                    </p>
                    {isLeader && (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Leader
                      </span>
                    )}
                  </div>
                  <p className={`text-5xl font-light tabular-nums leading-none tracking-tight ${isLeader ? "text-white" : "text-foreground"}`}>
                    {pct}<span className={`text-2xl ${isLeader ? "text-white/60" : "text-muted-foreground"}`}>%</span>
                  </p>
                  {/* Barre de progression */}
                  <div className={`h-1 w-full overflow-hidden rounded-full ${isLeader ? "bg-white/20" : "bg-muted"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${isLeader ? "bg-white" : "bg-estm-blue"}`}
                    />
                  </div>
                  <p className={`text-sm ${isLeader ? "text-white/60" : "text-muted-foreground"}`}>
                    {row.votes} bulletin{row.votes > 1 ? "s" : ""}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
          <div className="bg-card px-10 py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              En attente
            </p>
            <p className="mt-3 text-xl font-semibold tracking-tight">Résultats détaillés masqués</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              Le classement et les pourcentages seront affichés lorsque l&apos;administration autorisera la publication après clôture officielle.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
