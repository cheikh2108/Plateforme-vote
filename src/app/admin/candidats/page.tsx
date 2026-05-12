import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AdminCandidatesPage() {
  return (
    <div className="space-y-8">
      <Link href="/admin" className={cn(buttonVariants({ variant: "ghost" }), "-ml-2 inline-flex rounded-full")}>
        <ArrowLeft className="mr-2 size-4" aria-hidden />
        Retour
      </Link>
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Gestion des fiches
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Candidats</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Les fiches sont stockées dans PostgreSQL (table <code className="rounded bg-muted px-1 py-0.5 text-xs">candidates</code>
          ). Pour la première mise en production, importez vos données via SQL ou l’éditeur Supabase,
          puis reliez les médias au Storage si nécessaire.
        </p>
      </header>
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        Extension prévue : formulaires administrateur couplés aux politiques RLS — la structure base est déjà prête.
      </div>
    </div>
  );
}
