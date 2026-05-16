import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/data/elections";
import { hasSupabase } from "@/lib/env";
import { LogoutButton } from "@/components/layout/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabase) {
    redirect("/");
  }

  const role = await getCurrentUserRole();
  if (!role) {
    redirect("/admin-login?next=/admin");
  }
  if (role !== "admin") {
    // Compte existant mais sans rôle admin — indiquer clairement le problème
    redirect("/admin-login?error=not_admin");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <aside className="lg:w-60 lg:shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Administration</p>
                <p className="text-[11px] text-muted-foreground">Tableau de bord</p>
              </div>
            </div>
            <AdminNav />
            <div className="mt-5 border-t border-border pt-5">
              <LogoutButton
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                variant="ghost"
                size="sm"
                redirectTo="/admin-login"
              />
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
