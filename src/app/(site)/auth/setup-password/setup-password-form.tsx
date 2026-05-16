"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  nextPath: string;
};

export function SetupPasswordForm({ nextPath }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les deux mots de passe doivent être identiques.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe enregistré.");
      const safePath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/vote";
      router.push(safePath);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible d'enregistrer le mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Finalisation du compte
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Créez votre mot de passe</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Votre adresse a été vérifiée. Définissez maintenant un mot de passe pour revenir sur la plateforme sans
          redemander de code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Au moins 8 caractères"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Saisissez le mot de passe une seconde fois"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Enregistrement…
            </>
          ) : (
            "Enregistrer et continuer"
          )}
        </Button>
      </form>
    </div>
  );
}