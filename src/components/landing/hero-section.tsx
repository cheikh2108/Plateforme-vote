"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  closesAtText: string;
};

export function HeroSection({ closesAtText }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-line]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden border-b border-border/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(166,124,82,0.12),_transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:pb-28 lg:pt-24">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand" aria-hidden />
            Accès vérifié · vote anonyme · suivi maîtrisé
          </div>
          <div className="space-y-5">
            <h1
              data-hero-line
              className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Votez, suivez et publiez avec un parcours clair et rassurant.
            </h1>
            <p
              data-hero-line
              className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              {siteConfig.tagline} Chaque électeur vérifie son identité, choisit son mot de passe et accède à son
              espace en quelques secondes.
            </p>
          </div>
          <div data-hero-line className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/candidats"
              className={cn(buttonVariants({ size: "lg" }), "inline-flex rounded-full px-8")}
            >
              Voir les candidats
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
            <Link
              href="/vote"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "inline-flex rounded-full px-8",
              )}
            >
              Accéder au vote
            </Link>
          </div>
          <p data-hero-line className="text-xs text-muted-foreground">
            Code de vérification requis avant la création du mot de passe.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-3xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Fin du scrutin
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{closesAtText}</p>
          <div className="mt-6 h-px w-full bg-border" />
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Statut</dt>
              <dd className="font-medium text-foreground">Ouverture contrôlée</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Journalisation</dt>
              <dd className="font-medium text-foreground">Journal sécurisé</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Accès</dt>
              <dd className="font-medium text-foreground">Étudiants et administration</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
