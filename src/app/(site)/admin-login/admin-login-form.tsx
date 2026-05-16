"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  nextPath: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AdminLoginForm({ nextPath }: Props) {
  const router = useRouter();
  
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  function validateAdminEmail(): string | null {
    if (!hasSupabase) {
      toast.error("La configuration d'authentification n'est pas prête.");
      return null;
    }

    const trimmed = adminEmail.trim().toLowerCase();
    if (!isValidEmail(trimmed)) {
      toast.error("Entrez une adresse e-mail valide.");
      return null;
    }

    return trimmed;
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = validateAdminEmail();
    if (!trimmed) return;
    if (!adminPassword) {
      toast.error("Entrez le mot de passe administrateur.");
      return;
    }

    setAdminLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password: adminPassword,
      });

      if (error) throw error;
      toast.success("Connexion réussie.");
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de connexion.");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Tableau de bord
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Accès Administrateur</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Utilisez vos identifiants pour accéder aux outils de gestion du scrutin.
        </p>
      </div>

      <section className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <form className="space-y-5" onSubmit={handleAdminLogin}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">E-mail administrateur</Label>
            <Input
              id="admin-email"
              name="admin-email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@exemple.com"
              value={adminEmail}
              onChange={(ev) => setAdminEmail(ev.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe</Label>
            <Input
              id="admin-password"
              name="admin-password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Votre mot de passe"
              value={adminPassword}
              onChange={(ev) => setAdminPassword(ev.target.value)}
            />
          </div>

          <Button type="submit" disabled={adminLoading} className="w-full rounded-full">
            {adminLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Connexion…
              </>
            ) : (
              "Accéder à l'administration"
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
