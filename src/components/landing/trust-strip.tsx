"use client";

import { motion } from "framer-motion";

const proofs = [
  { index: "01", title: "Accès vérifié", detail: "Votre identité est confirmée via votre adresse académique avant d'accéder au bulletin." },
  { index: "02", title: "Anonymat garanti", detail: "Votre participation et votre choix sont enregistrés séparément — aucun lien possible entre les deux." },
  { index: "03", title: "Publication maîtrisée", detail: "Les résultats détaillés ne paraissent qu'à la décision officielle de l'administration." },
];

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-estm-blue text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {proofs.map((p, i) => (
            <motion.article
              key={p.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col gap-3 bg-estm-blue p-7"
            >
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.2em] text-white/40">
                {p.index}
              </span>
              <h3 className="text-lg font-semibold leading-tight text-white">{p.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{p.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
