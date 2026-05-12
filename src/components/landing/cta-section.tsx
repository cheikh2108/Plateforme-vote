import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="rounded-[2rem] border border-border bg-foreground px-6 py-12 text-background shadow-lg sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-background/70">
              Prêt à voter
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Entrez dans le parcours de vote sans friction.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-background/75">
              Vérification en deux étapes, création du mot de passe, accès au bulletin puis déconnexion visible.
              L&apos;expérience reste simple, même sur mobile.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6 text-foreground")}
            >
              <LogIn className="mr-2 size-4" aria-hidden />
              Commencer
            </Link>
            <Link
              href="/candidats"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full px-6 border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background",
              )}
            >
              Voir les candidatures
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}