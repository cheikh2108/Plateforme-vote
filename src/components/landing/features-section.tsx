import { BadgeCheck, BellRing, LayoutDashboard, LockKeyhole } from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "Vérification en 2 étapes",
    detail: "L&apos;étudiant reçoit un code, le valide, puis définit son mot de passe avant d&apos;accéder au vote.",
  },
  {
    icon: BadgeCheck,
    title: "Vote anonyme",
    detail: "Le compte sert à autoriser l’accès; le bulletin reste dissocié de l’identité.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord admin",
    detail: "L&apos;administration pilote l&apos;ouverture, la publication des résultats et la gestion des listes.",
  },
  {
    icon: BellRing,
    title: "Interface simple",
    detail: "Les libellés sont clairs, les boutons sont visibles et le parcours reste rapide sur mobile.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Fonctionnalités
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Un produit pensé pour rassurer avant de convertir.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          La page d&apos;accueil doit montrer immédiatement le bénéfice, le niveau de confiance et la simplicité du
          parcours.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <feature.icon className="size-6 text-brand" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}