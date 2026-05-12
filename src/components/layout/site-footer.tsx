import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:justify-between">
        <div className="max-w-md space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Plateforme électorale
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline} Architecture auditée, anonymat du bulletin,
            traçabilité technique sans exposition des choix individuels.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div className="space-y-3">
            <p className="font-medium text-foreground">Navigation</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/candidats" className="hover:text-foreground">
                  Candidats
                </Link>
              </li>
              <li>
                <Link href="/vote" className="hover:text-foreground">
                  Vote sécurisé
                </Link>
              </li>
              <li>
                <Link href="/resultats" className="hover:text-foreground">
                  Participation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-foreground">Confiance</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Auth domaine académique</li>
              <li>RLS PostgreSQL</li>
              <li>Temps réel anonymisé</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-foreground">Contact</p>
            <p className="text-muted-foreground">
              Support délégué vie étudiante — canal officiel de votre école.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name} · Infrastructure électorale étudiante
      </div>
    </footer>
  );
}
