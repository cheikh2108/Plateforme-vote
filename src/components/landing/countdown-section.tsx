"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  target: Date;
  label?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownSection({
  target,
  label = "Temps restant avant clôture",
}: Props) {
  const end = useMemo(() => target.getTime(), [target]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, end - now);
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  const blocks = [
    { label: "Jours", value: pad(days) },
    { label: "Heures", value: pad(hours) },
    { label: "Minutes", value: pad(minutes) },
    { label: "Secondes", value: pad(seconds) },
  ];

  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-lg space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Chronologie
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{label}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Le scrutin respecte les fenêtres horaires officielles. Après clôture, les résultats détaillés ne sont
            publiés que lorsque l’administration les autorise.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {blocks.map((b) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-sm"
            >
              <p className="text-3xl font-semibold tracking-tight tabular-nums">{b.value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{b.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
