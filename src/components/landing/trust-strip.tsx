import { CheckCircle2, ShieldCheck, Users2 } from "lucide-react";

const proofs = [
  {
    icon: ShieldCheck,
    title: "Accès verrouillé",
    detail: "Chaque compte est validé avant d'accéder au vote ou au tableau de bord.",
  },
  {
    icon: Users2,
    title: "Parcours clair",
    detail: "Étudiants, administration et super-admin disposent chacun d’un espace dédié.",
  },
  {
    icon: CheckCircle2,
    title: "Vote lisible",
    detail: "Code de vérification, création du mot de passe et confirmation explicite à chaque étape.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {proofs.map((proof) => (
            <article
              key={proof.title}
              className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm"
            >
              <proof.icon className="size-6 text-brand" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{proof.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{proof.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}