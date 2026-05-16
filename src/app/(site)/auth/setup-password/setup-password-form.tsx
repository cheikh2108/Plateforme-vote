"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  nextPath: string;
};

export function SetupPasswordForm({ nextPath }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const matches = password === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!hasMinLength) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!matches) {
      toast.error("Les deux mots de passe doivent être identiques.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe enregistré. Redirection…");
      const safePath =
        nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/vote";
      window.location.assign(safePath);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le mot de passe.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Finalisation du compte
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Créez votre mot de passe
        </h1>
        <p className="text-sm text-muted-foreground">
          Votre identité est vérifiée. Définissez un mot de passe pour revenir
          sans redemander de code à chaque connexion.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Au moins 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Masquer" : "Afficher"}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {/* Indicateur force */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex items-center gap-1 transition-colors",
                hasMinLength ? "text-estm-green" : "text-muted-foreground",
              )}
            >
              <CheckCircle2
                className={cn(
                  "size-3.5",
                  hasMinLength ? "opacity-100" : "opacity-30",
                )}
              />
              8 caractères minimum
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Saisissez une seconde fois"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(
              "rounded-xl",
              confirmPassword.length > 0 &&
                (matches ? "border-estm-green/60" : "border-destructive/50"),
            )}
          />
          {confirmPassword.length > 0 && !matches && (
            <p className="text-xs text-destructive">
              Les mots de passe ne correspondent pas.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !hasMinLength || !matches}
          className="w-full rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Enregistrement…
            </>
          ) : (
            "Enregistrer et accéder au vote"
          )}
        </Button>
      </form>
    </div>
  );
}
