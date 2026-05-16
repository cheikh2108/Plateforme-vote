"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "1",
    title: "Vérification d'identité",
    detail:
      "Saisissez votre adresse académique. Un code à 6 chiffres est envoyé — vous le validez, puis vous créez votre mot de passe personnel.",
    aside: "~60 secondes",
  },
  {
    n: "2",
    title: "Dépôt du bulletin",
    detail:
      "Choisissez une liste parmi les candidatures officielles. Une confirmation explicite avant envoi — action définitive et anonyme.",
    aside: "Irréversible",
  },
  {
    n: "3",
    title: "Résultats publiés",
    detail:
      "Pendant le scrutin : participation globale visible. Après clôture : l'administration publie les résultats détaillés au moment choisi.",
    aside: "Contrôlé",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-14 space-y-4">
          <span className="editorial-rule" />
          <h2 className="text-4xl font-light tracking-tight">
            Comment ça{" "}
            <span className="font-semibold">fonctionne.</span>
          </h2>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Animated connector line */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-8 right-8 top-8 hidden h-px origin-left bg-gradient-to-r from-estm-blue via-estm-blue/40 to-transparent md:block"
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col gap-6"
            >
              {/* Double-bezel step number */}
              <div className="flex items-center gap-4">
                <div className="relative z-10 shrink-0 rounded-full border-2 border-estm-blue bg-background p-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-estm-blue">
                    <span className="text-base font-semibold leading-none text-white">{s.n}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {s.aside}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold leading-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
