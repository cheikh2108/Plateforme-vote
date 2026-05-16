"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Pourquoi un code de vérification, puis un mot de passe ?",
    a: "Le code reçu par e-mail confirme que l'adresse appartient bien à un étudiant de l'établissement. Le mot de passe vous permet ensuite de vous reconnecter facilement sans recommencer cette étape.",
  },
  {
    q: "L'administration peut-elle voir pour qui j'ai voté ?",
    a: "Non. La plateforme enregistre uniquement que vous avez participé — jamais votre choix. Ces deux informations sont séparées et ne peuvent pas être rapprochées.",
  },
  {
    q: "Puis-je modifier mon vote après confirmation ?",
    a: "Non. Avant de confirmer, un écran vous rappelle explicitement que l'action est définitive. Une fois validé, votre bulletin ne peut plus être modifié ni retiré.",
  },
  {
    q: "Quand les résultats sont-ils visibles ?",
    a: "Pendant le scrutin, seul le nombre de participants est affiché. Les résultats détaillés sont publiés uniquement lorsque l'administration le décide, après la clôture officielle.",
  },
  {
    q: "Mon adresse e-mail doit-elle être celle de l'école ?",
    a: "Oui. Seules les adresses de l'établissement sont acceptées. Toute tentative avec une adresse personnelle est automatiquement refusée.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr]">

        {/* Left — sticky editorial title */}
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <span className="editorial-rule" />
          <h2 className="text-4xl font-light leading-tight tracking-tight">
            Questions
            <br />
            <span className="font-semibold">fréquentes.</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Les réponses aux doutes légitimes avant de voter.
          </p>
        </div>

        {/* Right — accordion with brand accent on open state */}
        <div className="divide-y divide-border">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="relative">
                {/* ESTM blue left-border accent when open */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      key="accent"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -left-4 top-0 h-full w-0.5 origin-top bg-estm-blue sm:-left-6"
                      aria-hidden
                    />
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base font-medium leading-snug transition-colors ${isOpen ? "text-estm-blue" : "text-foreground"}`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? "border-estm-blue bg-estm-blue text-white"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
