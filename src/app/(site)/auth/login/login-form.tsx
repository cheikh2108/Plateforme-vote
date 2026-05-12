"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { siteConfig, isAllowedStudentEmail } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/env";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  nextPath: string;
};

export function LoginForm({ nextPath }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingMode, setLoadingMode] = useState<"magic" | "password" | null>(null);

  function getValidatedEmail(): string | null {
    if (!hasSupabase) {
      toast.error("Supabase n’est pas configuré — ajoutez les variables d’environnement.");
      return null;
    }

    const trimmed = email.trim().toLowerCase();
    if (!isAllowedStudentEmail(trimmed)) {
      toast.error(`Seuls les emails ${siteConfig.allowedEmailDomain} sont autorisés.`);
      return null;
    }

    return trimmed;
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = getValidatedEmail();
    if (!trimmed) return;

    setLoadingMode("magic");
    try {
      const supabase = createClient();
      const nextEncoded = encodeURIComponent(nextPath.startsWith("/") ? nextPath : `/${nextPath}`);
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${siteConfig.url}/auth/callback?next=${nextEncoded}`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      toast.success("Lien envoyé — vérifiez votre boîte académique.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de l’envoi du lien.");
    } finally {
      setLoadingMode(null);
    }
  }

  async function handlePasswordLogin() {
    const trimmed = getValidatedEmail();
    if (!trimmed) return;
    if (!password) {
      toast.error("Entrez votre mot de passe pour la connexion admin.");
      return;
    }

    setLoadingMode("password");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      if (error) throw error;
      toast.success("Connexion réussie.");
      const destination = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
      router.push(destination);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de connexion.");
    } finally {
      setLoadingMode(null);
    }
  }

  return (
    <>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Authentification
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Connexion étudiante</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nous envoyons un lien sécurisé Supabase (magic link). Seuls les comptes{" "}
          <span className="font-medium text-foreground">@{siteConfig.allowedEmailDomain}</span> peuvent voter.
        </p>
      </div>

      <form onSubmit={handleMagicLink} className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email académique</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={`vous@${siteConfig.allowedEmailDomain}`}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe admin (optionnel)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Utilisé seulement pour la connexion admin"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        <Button type="submit" disabled={loadingMode !== null} className="w-full rounded-full">
          {loadingMode === "magic" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Envoi…
            </>
          ) : (
            "Recevoir le lien"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={loadingMode !== null}
          className="w-full rounded-full"
          onClick={() => void handlePasswordLogin()}
        >
          {loadingMode === "password" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Connexion…
            </>
          ) : (
            "Connexion admin par mot de passe"
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          En continuant, vous acceptez les conditions de vote officielles de votre institution. Si la limite email est
          atteinte, utilisez la connexion admin par mot de passe.
        </p>
      </form>

      <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "-mt-4 self-start rounded-full")}>
        Retour à l’accueil
      </Link>
    </>
  );
}
