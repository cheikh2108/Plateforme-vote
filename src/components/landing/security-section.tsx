import { Lock, ScanEye, Server } from "lucide-react";

const items = [
  {
    icon: Lock,
    title: "Bulletin dissocié",
    body: "Le registre de participation et les bulletins anonymes sont isolés pour éviter tout rapprochement des choix.",
  },
  {
    icon: ScanEye,
    title: "Contrôle d’accès fin",
    body: "Accès limité aux comptes autorisés, lecture minimale et vote protégé par une validation stricte.",
  },
  {
    icon: Server,
    title: "Temps réel sobre",
    body: "Le suivi en direct expose uniquement les agrégats publics, jamais les choix individuels.",
  },
];

export function SecuritySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Sécurité & confiance
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Une architecture pensée pour la légitimité électorale.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          La plateforme refuse le spectacle technique superflu : priorité à la sobriété, à la traçabilité et à la séparation
          stricte des données sensibles.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm transition hover:border-brand/40"
          >
            <item.icon className="size-6 text-brand" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
