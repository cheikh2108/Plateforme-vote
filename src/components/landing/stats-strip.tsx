"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  participation: number;
  candidates: number;
  uptimeLabel?: string;
};

export function StatsStrip({
  participation,
  candidates,
  uptimeLabel = "Temps réel",
}: Props) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, participation, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [participation]);

  return (
    <section className="border-b border-border/70 bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="space-y-2"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Participation observée
          </p>
          <p className="text-4xl font-semibold tracking-tight text-foreground">
            {displayCount}
            <span className="text-lg font-normal text-muted-foreground"> voix enregistrées</span>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="space-y-2"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Listes en lice
          </p>
          <p className="text-4xl font-semibold tracking-tight text-foreground">{candidates}</p>
          <p className="text-sm text-muted-foreground">Cartes candidates enrichies & auditables.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Monitoring
          </p>
          <p className="text-4xl font-semibold tracking-tight text-foreground">{uptimeLabel}</p>
          <p className="text-sm text-muted-foreground">
            Suivi en direct des indicateurs agrégés pendant la période de vote.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
