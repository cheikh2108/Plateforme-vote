import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getActiveElection } from "@/lib/data/elections";

export const dynamic = "force-dynamic";

export default async function AdminElectionPage() {
  const election = await getActiveElection();

  return (
    <div className="space-y-8">
      <Link href="/admin" className={cn(buttonVariants({ variant: "ghost" }), "-ml-2 inline-flex rounded-full")}>
        <ArrowLeft className="mr-2 size-4" aria-hidden />
        Retour
      </Link>
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Paramètres de scrutin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Élection</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Les réglages principaux du scrutin sont centralisés dans la synthèse. Les dates d&apos;ouverture et de clôture
          restent visibles ici pour contrôle.
        </p>
      </header>

      {election ? (
        <dl className="grid gap-4 rounded-3xl border border-border bg-card p-8 text-sm shadow-sm md:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Titre</dt>
            <dd className="mt-1 font-medium">{election.title}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Suffixe email autorisé</dt>
            <dd className="mt-1 font-medium">{election.eligible_email_suffix}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ouverture</dt>
            <dd className="mt-1 font-medium">
              {new Date(election.opens_at).toLocaleString("fr-FR")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Clôture</dt>
            <dd className="mt-1 font-medium">
              {new Date(election.closes_at).toLocaleString("fr-FR")}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune élection trouvée.</p>
      )}
    </div>
  );
}
