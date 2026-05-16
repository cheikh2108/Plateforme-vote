"use client";

import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function UserProfileMenu({ className }: Props) {
  const [user, setUser] = useState<{ email?: string; id: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        setRole(data?.role ?? null);
      }
    }

    void loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => void loadUser());
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  if (!user) return null;

  const email = user.email ?? "";
  const initial = email.slice(0, 1).toUpperCase();
  const isAdmin = role === "admin";

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm transition hover:border-foreground/30 hover:shadow-sm"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-estm-blue text-[11px] font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate text-xs font-medium text-foreground sm:block">
          {email}
        </span>
      </button>

      {open && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Identité */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-estm-blue text-sm font-bold text-white">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{email}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "Administrateur" : "Étudiant électeur"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-1.5">
              {isAdmin && (
                <a
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                >
                  <LayoutDashboard className="size-4 text-muted-foreground" />
                  Tableau de bord
                </a>
              )}
              <button
                onClick={() => void handleLogout()}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted"
              >
                <LogOut className="size-4 text-muted-foreground" />
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
