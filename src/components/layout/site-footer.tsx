import Link from "next/link";
import { siteConfig } from "@/config/site";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Corps footer */}
        <div className="grid gap-12 py-14 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Identité */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Plateforme électorale étudiante
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">Eligo</p>
              <p className="text-xs text-muted-foreground italic">« je choisis »</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Plateforme
            </p>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/candidats", label: "Candidats" },
                { href: "/vote", label: "Voter" },
                { href: "/resultats", label: "Résultats" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accès */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Accès
            </p>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/auth/login", label: "Connexion étudiant" },
                { href: "/admin-login", label: "Administration" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Garanties */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Garanties
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Anonymat garanti</li>
              <li>Accès académique uniquement</li>
              <li>Un vote par électeur</li>
            </ul>
          </div>
        </div>

        {/* Barre basse */}
        <div className="flex flex-col items-start justify-between gap-2 border-t border-border py-5 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.name} · Tous droits réservés
          </p>
          <p className="text-xs text-muted-foreground">
            Scrutin sécurisé · résultats sous contrôle institutionnel
          </p>
        </div>
      </div>
    </footer>
  );
}
