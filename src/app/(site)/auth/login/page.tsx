import { LoginForm } from "./login-form";
import { siteConfig } from "@/config/site";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/vote";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Left — branding */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Espace étudiant
            </p>
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              Votre voix, vérifiée et anonyme.
            </h2>
            <p className="text-sm text-muted-foreground">
              La plateforme électorale de{" "}
              <span className="font-medium text-foreground">{siteConfig.name}</span>.
              Un vote par étudiant, un bulletin entièrement anonyme.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "100%", label: "Anonymat garanti" },
              { n: "1 vote", label: "Par étudiant" },
              { n: "Zéro", label: "Papier utilisé" },
              { n: "Temps réel", label: "Résultats" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card p-3"
              >
                <p className="text-base font-semibold text-foreground">{item.n}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
