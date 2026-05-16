import { AdminLoginForm } from "./admin-login-form";
import { siteConfig } from "@/config/site";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/admin";
  const error = params.error ?? null;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* Left — branding */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {siteConfig.shortName}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              Pilotez votre scrutin depuis un seul endroit.
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Ouvrez et fermez le vote en un clic",
              "Visualisez les résultats en temps réel",
              "Publiez les résultats quand vous êtes prêt",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-foreground">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div>
          <AdminLoginForm nextPath={nextPath} error={error} />
        </div>
      </div>
    </div>
  );
}
