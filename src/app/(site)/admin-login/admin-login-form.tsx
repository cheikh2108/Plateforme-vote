"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";

type Props = {
  nextPath: string;
  error?: string | null;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AdminLoginForm({ nextPath, error }: Props) {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      // Hard navigation pour forcer le Server Component à relire les cookies de session
      window.location.assign(nextPath);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Identifiants incorrects.");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Bandeau erreur */}
      {error === "not_admin" && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Accès refusé</p>
            <p className="mt-0.5 text-muted-foreground">
              Ce compte ne dispose pas des droits administrateur. Contactez le responsable de la plateforme pour obtenir l&apos;accès.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="size-3.5 text-brand" />
          Accès restreint
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Administration{" "}
          <span className="text-muted-foreground">{siteConfig.shortName}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Tableau de bord réservé aux gestionnaires du scrutin.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleAdminLogin}
        className="space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="text-sm font-medium">
            Adresse e-mail
          </Label>
          <Input
            id="admin-email"
            name="admin-email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@exemple.com"
            value={adminEmail}
            onChange={(ev) => setAdminEmail(ev.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password" className="text-sm font-medium">
            Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="admin-password"
              name="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={adminPassword}
              onChange={(ev) => setAdminPassword(ev.target.value)}
              className="rounded-xl pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={adminLoading}
          className="w-full rounded-full"
        >
          {adminLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Connexion…
            </>
          ) : (
            "Accéder au tableau de bord"
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Espace étudiant ?{" "}
        <a href="/auth/login" className="font-medium text-foreground hover:underline underline-offset-2">
          Connexion étudiant
        </a>
      </p>
    </div>
  );
}
