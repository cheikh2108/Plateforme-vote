const faqs = [
  {
    question: "Pourquoi demander un code puis un mot de passe ?",
    answer:
      "Le code confirme la propriété de l’adresse e-mail, puis le mot de passe simplifie les retours futurs sans refaire toute la vérification.",
  },
  {
    question: "L'administration voit-elle les bulletins individuels ?",
    answer:
      "Non. Le vote est conçu pour dissocier l'identité du bulletin. L'administration ne consulte que les indicateurs autorisés.",
  },
  {
    question: "Peut-on gérer plusieurs écoles ?",
    answer:
      "Oui. La structure actuelle est prévue pour évoluer vers un super-admin et plusieurs écoles, chacune avec ses accès propres.",
  },
  {
    question: "Comment se passe la fermeture du scrutin ?",
    answer:
      "L'ouverture et la clôture sont pilotées depuis l'administration. Après fermeture, la page publique affiche les résultats selon les droits accordés.",
  },
];

export function FaqSection() {
  return (
    <section className="border-y border-border/70 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">FAQ</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Les réponses aux questions les plus fréquentes.
          </h2>
        </div>

        <div className="mt-12 grid gap-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl border border-border bg-card p-6 shadow-sm">
              <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight outline-none">
                <span>{faq.question}</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}