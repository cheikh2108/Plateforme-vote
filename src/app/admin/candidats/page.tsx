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
          Les fiches sont gérées dans la base de données. Ajoutez ici les visuels, les programmes et les promesses des
          listes avant l&apos;ouverture du scrutin.
        </p>
      </header>
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        La gestion détaillée des candidats sera ajoutée dans la prochaine étape.
      </div>
    </div>
  );
}
