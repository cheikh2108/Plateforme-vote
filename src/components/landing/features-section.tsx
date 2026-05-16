"use client";

import { motion } from "framer-motion";
import { LockKeyhole, BadgeCheck, LayoutDashboard, Smartphone } from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    index: "01",
    title: "Vérification en deux étapes",
    detail:
      "Votre adresse académique est confirmée par un code reçu par e-mail, puis vous créez un mot de passe personnel. Votre identité est établie avant tout accès.",
    wide: true,
  },
  {
    icon: BadgeCheck,
    index: "02",
    title: "Anonymat garanti par conception",
    detail:
      "Votre participation et votre choix sont enregistrés séparément, sans lien entre les deux. Il est impossible de savoir pour qui vous avez voté.",
    wide: false,
  },
  {
    icon: LayoutDashboard,
    index: "03",
    title: "Pilotage admin en direct",
    detail:
      "Ouverture/fermeture du scrutin, publication des résultats, export PDF — tout depuis un seul tableau de bord.",
    wide: false,
  },
  {
    icon: Smartphone,
    index: "04",
    title: "Parcours mobile-first",
    detail:
      "Conçu pour être utilisé sur téléphone. Chaque action tient en une seule vue, sans défilement excessif.",
    wide: false,
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      {/* Header éditorial */}
      <div className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-4">
          <span className="editorial-rule" />
          <h2 className="text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Ce que la plateforme
            <br />
            <span className="font-semibold">garantit concrètement.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
          Quatre engagements concrets qui répondent aux questions légitimes de chaque électeur.
        </p>
      </div>

      {/* Grille asymétrique */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Grande carte */}
        {features.slice(0, 1).map((f) => (
          <motion.article
            key={f.index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between gap-8 rounded-2xl bg-estm-blue p-7 text-white md:col-span-1 md:row-span-2"
          >
            <div className="flex items-start justify-between">
              <f.icon className="size-7 opacity-70" />
              <span className="text-xs font-semibold tabular-nums tracking-[0.2em] opacity-30">{f.index}</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold leading-tight">{f.title}</h3>
              <p className="text-sm leading-relaxed opacity-60">{f.detail}</p>
            </div>
          </motion.article>
        ))}

        {/* Petites cartes */}
        {features.slice(1).map((f, i) => (
          <motion.article
            key={f.index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i + 1) * 0.07 }}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <f.icon className="size-5 text-muted-foreground" />
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.18em] text-muted-foreground/50">
                {f.index}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold leading-tight">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
