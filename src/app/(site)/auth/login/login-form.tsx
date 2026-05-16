"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
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

type Mode = "choose" | "otp-email" | "otp-code" | "password";

export function LoginForm({ nextPath }: Props) {
  const destination = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/vote";

  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function validateEmail(): string | null {
    if (!hasSupabase) {
      toast.error("La configuration d'authentification n'est pas prête.");
      return null;
    }
    const trimmed = email.trim().toLowerCase();
    if (!isAllowedStudentEmail(trimmed)) {
      toast.error(`Seuls les emails @${siteConfig.allowedEmailDomain} sont autorisés.`);
      return null;
    }
    return trimmed;
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = validateEmail();
    if (!trimmed) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteConfig.url}/auth/callback?next=${encodeURIComponent(destination)}`,
        },
      });
      if (error) throw error;
      setMode("otp-code");
      toast.success("Code envoyé — vérifiez votre boîte mail.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible d'envoyer le code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = validateEmail();
    if (!trimmed) return;
    const token = code.trim();
    if (!token) {
      toast.error("Entrez le code reçu par e-mail.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email: trimmed, token, type: "email" });
      if (error) throw error;
      toast.success("Identité vérifiée. Création de votre mot de passe…");
      window.location.assign(`/auth/setup-password?next=${encodeURIComponent(destination)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = validateEmail();
    if (!trimmed) return;
    if (!password) {
      toast.error("Entrez votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: trimmed, password });
      if (error) throw error;
      toast.success("Connexion réussie.");
      window.location.assign(destination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  }

  // ── Écran de choix ─────────────────────────────────────────────
  if (mode === "choose") {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Accès sécurisé
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Connexion Étudiant</h1>
          <p className="text-sm text-muted-foreground">
            Utilisez votre adresse académique <span className="font-medium text-foreground">@{siteConfig.allowedEmailDomain}</span>.
          </p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => setMode("otp-email")}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-foreground/30 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition group-hover:bg-estm-blue group-hover:text-white">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Première connexion</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Recevez un code par e-mail pour vérifier votre identité et créer un mot de passe.
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode("password")}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-foreground/30 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition group-hover:bg-estm-blue group-hover:text-white">
              <KeyRound className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Retour sur la plateforme</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Vous avez déjà créé un mot de passe lors d&apos;une session précédente.
              </p>
            </div>
          </button>
        </div>

        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full text-muted-foreground")}>
          <ArrowLeft className="mr-1.5 size-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  // ── Saisie email + envoi OTP ────────────────────────────────────
  if (mode === "otp-email") {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <button onClick={() => setMode("choose")} className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Retour
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Première connexion</h1>
          <p className="text-sm text-muted-foreground">
            Saisissez votre adresse académique pour recevoir un code de vérification.
          </p>
        </div>
        <form onSubmit={handleSendOtp} className="space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="email">Email académique</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder={`vous@${siteConfig.allowedEmailDomain}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Envoi…</> : "Envoyer le code"}
          </Button>
        </form>
      </div>
    );
  }

  // ── Vérification du code OTP ────────────────────────────────────
  if (mode === "otp-code") {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <button onClick={() => setMode("otp-email")} className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Retour
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Vérifiez votre e-mail</h1>
          <p className="text-sm text-muted-foreground">
            Un code à 6 chiffres a été envoyé à <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="otp-code">Code de vérification</Label>
            <Input
              id="otp-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-xl text-center text-2xl tracking-[0.4em]"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Vérification…</> : "Confirmer le code"}
          </Button>
          <button
            type="button"
            onClick={() => void handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Renvoyer le code
          </button>
        </form>
      </div>
    );
  }

  // ── Connexion par mot de passe ──────────────────────────────────
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <button onClick={() => setMode("choose")} className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Retour
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre e-mail académique et votre mot de passe.
        </p>
      </div>
      <form onSubmit={handlePasswordLogin} className="space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="pw-email">Email académique</Label>
          <Input
            id="pw-email"
            type="email"
            autoComplete="email"
            required
            placeholder={`vous@${siteConfig.allowedEmailDomain}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw-password">Mot de passe</Label>
          <Input
            id="pw-password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Connexion…</> : "Se connecter"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Mot de passe oublié ?{" "}
          <button
            type="button"
            onClick={() => { setMode("otp-email"); setPassword(""); }}
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Recevoir un nouveau code
          </button>
        </p>
      </form>
    </div>
  );
}
