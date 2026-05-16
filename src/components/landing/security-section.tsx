"use client";

import { motion } from "framer-motion";

const items = [
  {
    label: "Séparation totale des données",
    body: "Qui a voté et pour qui sont deux informations stockées séparément, sans aucun lien entre elles. Personne ne peut reconstruire votre choix.",
  },
  {
    label: "Adresse académique obligatoire",
    body: "Seules les adresses e-mail de l'établissement sont acceptées. Aucun accès possible depuis une adresse personnelle.",
  },
  {
    label: "Un vote, une fois",
    body: "Il est impossible de voter deux fois. Ce verrou est gravé au niveau de la plateforme — aucune exception, même administrative.",
  },
  {
    label: "Accès strictement contrôlé",
    body: "Chaque action est soumise à des règles d'accès précises. L'application ne peut pas outrepasser ces règles, même en cas d'erreur.",
  },
  {
    label: "Résultats sous contrôle institutionnel",
    body: "Les résultats détaillés ne sont publiés qu'au moment choisi par l'administration. Rien ne s'affiche avant la décision officielle.",
  },
  {
    label: "Opérations sensibles sécurisées",
    body: "Les actions critiques comme le dépôt du bulletin s'exécutent sous un niveau de privilège élevé, sans que l'application cliente y ait accès.",
  },
];

export function SecuritySection() {
  return (
    <section className="bg-estm-blue text-white">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">

        {/* Header inversé */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-4">
            <span className="editorial-rule" style={{ background: "rgba(255,255,255,0.4)" }} />
            <h2 className="text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              Conçu pour
              <br />
              <span className="font-semibold">inspirer confiance.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/50 lg:text-right">
            Six garanties concrètes sur lesquelles repose l&apos;intégrité de chaque scrutin.
          </p>
        </div>

        {/* Grille — séparateurs minimalistes */}
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
              className="flex flex-col gap-3 bg-estm-blue p-6"
            >
              <h3 className="text-sm font-semibold leading-tight text-white">
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
