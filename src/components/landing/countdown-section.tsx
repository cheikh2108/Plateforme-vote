"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { target: Date; label?: string };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

type Block = { label: string; value: string };

function AnimDigit({ char }: { char: string }) {
  return (
    <span className="relative inline-block w-[0.6em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "-60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "60%", opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
      {/* invisible spacer so the container doesn't collapse */}
      <span className="invisible">{char}</span>
    </span>
  );
}

function CountBlock({ block, index }: { block: Block; index: number }) {
  const chars = block.value.split("");
  const isSeconds = block.label === "Sec";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3"
    >
      {/* Double-bezel container */}
      <div className={`rounded-2xl border p-1 shadow-sm ${isSeconds ? "border-estm-blue/30 bg-estm-blue" : "border-border bg-card"}`}>
        <div className={`flex items-center justify-center rounded-xl px-4 py-3 sm:px-6 sm:py-4 ${isSeconds ? "border border-white/20 bg-white/10" : "border border-border/50 bg-muted/30"}`}>
          <span
            className={`flex overflow-hidden text-4xl font-light leading-none tracking-tighter sm:text-5xl ${isSeconds ? "text-white" : "text-foreground"}`}
            aria-label={block.value}
          >
            {chars.map((c, i) => (
              <AnimDigit key={i} char={c} />
            ))}
          </span>
        </div>
      </div>
      <span className={`text-[9px] font-semibold uppercase tracking-[0.25em] ${isSeconds ? "text-estm-blue" : "text-muted-foreground"}`}>
        {block.label}
      </span>
    </motion.div>
  );
}

export function CountdownSection({ target, label = "Temps restant avant clôture" }: Props) {
  const end = useMemo(() => target.getTime(), [target]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const blocks: Block[] =
    now === null
      ? [
          { label: "Jours", value: "--" },
          { label: "Heures", value: "--" },
          { label: "Min", value: "--" },
          { label: "Sec", value: "--" },
        ]
      : (() => {
          const r = Math.max(0, end - now);
          return [
            { label: "Jours", value: pad(Math.floor(r / 86400000)) },
            { label: "Heures", value: pad(Math.floor((r % 86400000) / 3600000)) },
            { label: "Min", value: pad(Math.floor((r % 3600000) / 60000)) },
            { label: "Sec", value: pad(Math.floor((r % 60000) / 1000)) },
          ];
        })();

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xs space-y-4">
            <span className="editorial-rule" />
            <h2 className="text-2xl font-light leading-snug tracking-tight">
              Fenêtre électorale{" "}
              <span className="font-semibold">en cours</span>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {label}. Après clôture, les résultats ne paraissent qu&apos;à la décision de l&apos;administration.
            </p>
          </div>

          <div className="flex items-end gap-3 sm:gap-4">
            {blocks.map((b, i) => (
              <CountBlock key={b.label} block={b} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
