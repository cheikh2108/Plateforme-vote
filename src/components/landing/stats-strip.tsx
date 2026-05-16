"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  participation: number;
  candidates: number;
};

export function StatsStrip({ participation, candidates }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const c = animate(0, participation, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => c.stop();
  }, [participation]);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Asymmetric 3-col stats — last col inverts to ESTM blue */}
        <div className="grid overflow-hidden sm:grid-cols-3">
          {/* Col 1 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2 border-b border-border py-10 sm:border-b-0 sm:border-r sm:pr-8"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Votes enregistrés
            </span>
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-5xl font-light leading-none tracking-tight text-foreground">
                {count}
              </span>
              <span className="text-lg font-light text-muted-foreground">voix</span>
            </div>
          </motion.div>

          {/* Col 2 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2 border-b border-border py-10 sm:border-b-0 sm:border-r sm:px-8"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Listes candidates
            </span>
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-5xl font-light leading-none tracking-tight text-foreground">
                {candidates}
              </span>
              <span className="text-lg font-light text-muted-foreground">listes</span>
            </div>
          </motion.div>

          {/* Col 3 — inverted accent */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between gap-3 bg-estm-blue py-10 sm:pl-8"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
              Intégrité
            </span>
            <div className="flex items-baseline gap-1 tabular-nums">
              <span className="text-5xl font-light leading-none tracking-tight text-white">
                100
              </span>
              <span className="text-2xl font-light text-white/60">%</span>
            </div>
            <p className="text-xs leading-relaxed text-white/50">
              Bulletins anonymes, jamais liés à l&apos;identité.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
