import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      {/* Double-bezel CTA block */}
      <div className="rounded-2xl border border-border p-1 shadow-sm">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card px-8 py-14 sm:px-12 lg:px-16">

          {/* Diagonal score-line texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 18px)",
            }}
          />

          {/* Large decorative checkmark */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-6 select-none text-[10rem] font-black leading-none text-estm-blue/[0.04] lg:text-[16rem]"
          >
            ✓
          </span>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl space-y-5">
              <span className="editorial-rule" />
              <h2 className="text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Prêt à déposer
                <br />
                <span className="font-semibold">votre bulletin.</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {siteConfig.tagline} Le parcours prend moins d&apos;une minute.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-estm-blue px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-estm-blue-hover hover:gap-3"
              >
                Commencer
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/candidats"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition hover:border-estm-blue/30 hover:bg-estm-blue-light hover:text-estm-blue"
              >
                Voir les candidats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
