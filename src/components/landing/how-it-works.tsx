const steps = [
  {
    title: "Vérification",
    detail: "Un code est envoyé par e-mail pour confirmer que le compte appartient bien à l'électeur.",
  },
  {
    title: "Vote anonyme",
    detail: "Sélection d’une liste, confirmation explicite, puis dépôt du bulletin sans exposition d’identité.",
  },
  {
    title: "Publication maîtrisée",
    detail: "Pendant le scrutin : participation uniquement. Après clôture : résultats détaillés publiés par l’administration.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/70 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Fonctionnement
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Un parcours clair, sans friction inutile.
            </h2>
          </div>
          <ol className="grid flex-1 gap-6">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-5 rounded-3xl border border-border bg-background/80 p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
