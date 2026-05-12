import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LineChart, Users } from "lucide-react";
import { getCurrentUserRole } from "@/lib/data/elections";
import { hasSupabase } from "@/lib/env";

const links = [
  { href: "/admin", label: "Synthèse", icon: LayoutDashboard },
  { href: "/admin/candidats", label: "Candidats", icon: Users },
  { href: "/admin/election", label: "Élection", icon: LineChart },
];

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
    redirect("/auth/login?next=/admin");
  }
  if (role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Administration
            </p>
            <nav className="mt-6 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <l.icon className="size-4" aria-hidden />
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
