"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = { closesAtText: string };

export function HeroSection({ closesAtText }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reveal]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.09,
          ease: "power4.out",
          delay: 0.05,
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-b border-border"
    >
      {/* ── Ballot-paper lined background ────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 39px, var(--border) 39px, var(--border) 40px)",
          backgroundSize: "100% 40px",
          opacity: 0.35,
        }}
      />

      {/* ── Large background letter — ESTM brand anchor ──────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-6 select-none text-[clamp(280px,38vw,520px)] font-black leading-none text-estm-blue"
        style={{ opacity: 0.025, letterSpacing: "-0.06em" }}
      >
        V
      </div>

      {/* ── Grain texture ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-20 sm:px-6 lg:pb-36 lg:pt-32">
        {/* Kicker line */}
        <div data-reveal className="mb-10 flex items-center gap-4">
          <span className="editorial-rule" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {siteConfig.name} · Scrutin officiel
          </span>
        </div>

        {/* ── Main title — deliberate weight split ─────────────────── */}
        <h1
          data-reveal
          className="max-w-4xl text-balance text-[clamp(2.6rem,7vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          Votre voix,{" "}
          <em className="not-italic font-semibold text-estm-blue">vérifiée.</em>
          <br />
          Votre bulletin,{" "}
          <em className="not-italic font-semibold">anonyme.</em>
        </h1>

        <p
          data-reveal
          className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {siteConfig.tagline}
        </p>

        {/* ── CTA cluster ───────────────────────────────────────────── */}
        <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/vote"
            className="inline-flex items-center gap-2.5 rounded-full bg-estm-blue px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-estm-blue-hover hover:gap-3.5"
          >
            Accéder au vote
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/candidats"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
          >
            Voir les candidatures
          </Link>
        </div>

        {/* ── Double-bezel closing date aside ───────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "mt-16 inline-flex flex-col gap-2",
            "lg:absolute lg:bottom-28 lg:right-8 lg:mt-0",
          )}
        >
          {/* Outer bezel */}
          <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
            {/* Inner bezel */}
            <div className="rounded-lg border border-estm-blue/15 bg-estm-blue-light px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-estm-blue/60">
                Clôture du scrutin
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-estm-blue">
                {closesAtText}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
