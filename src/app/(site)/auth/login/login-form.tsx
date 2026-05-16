"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeNextPath(nextPath: string) {
  return nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/vote";
}

export function LoginForm({ nextPath }: Props) {
  const router = useRouter();
  const destinationPath = normalizeNextPath(nextPath);

  const [studentEmail, setStudentEmail] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [studentCodeSent, setStudentCodeSent] = useState(false);
  const [studentLoading, setStudentLoading] = useState<"send" | "verify" | null>(null);

  function validateStudentEmail(): string | null {
    if (!hasSupabase) {
      toast.error("La configuration d'authentification n'est pas prête.");
      return null;
    }

    const trimmed = studentEmail.trim().toLowerCase();
    if (!isAllowedStudentEmail(trimmed)) {
      toast.error(`Seuls les emails ${siteConfig.allowedEmailDomain} sont autorisés.`);
      return null;
    }

    return trimmed;
  }

  async function handleSendStudentCode(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = validateStudentEmail();
    if (!trimmed) return;

    setStudentLoading("send");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteConfig.url}/auth/callback?next=${encodeURIComponent(destinationPath)}`,
        },
      });

      if (error) throw error;
      setStudentCodeSent(true);
      toast.success("Code de vérification envoyé.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible d'envoyer le code.");
    } finally {
      setStudentLoading(null);
    }
  }

  async function handleVerifyStudentCode() {
    const trimmed = validateStudentEmail();
    if (!trimmed) return;

    const token = studentCode.trim();
    if (!token) {
      toast.error("Entrez le code reçu par e-mail.");
      return;
    }

    setStudentLoading("verify");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: trimmed,
        token,
        type: "email",
      });

      if (error) throw error;
      toast.success("Compte vérifié. Choisissez maintenant votre mot de passe.");
      router.push(`/auth/setup-password?next=${encodeURIComponent(destinationPath)}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Code invalide ou expiré.");
    } finally {
      setStudentLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Accès sécurisé
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Connexion Étudiant</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Validez votre e-mail, recevez un code de vérification puis créez votre mot de passe.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <section className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Espace étudiant
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Recevoir un code</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Saisissez votre adresse académique, puis entrez le code reçu pour finaliser votre compte.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSendStudentCode}>
            <div className="space-y-2">
              <Label htmlFor="student-email">Email académique</Label>
              <Input
                id="student-email"
                name="student-email"
                type="email"
                autoComplete="email"
                required
                placeholder={`vous@${siteConfig.allowedEmailDomain}`}
                value={studentEmail}
                onChange={(ev) => setStudentEmail(ev.target.value)}
              />
            </div>

            <Button type="submit" disabled={studentLoading !== null} className="w-full rounded-full">
              {studentLoading === "send" ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  Envoi du code…
                </>
              ) : studentCodeSent ? (
                "Renvoyer le code"
              ) : (
                "Envoyer le code de vérification"
              )}
            </Button>

            {studentCodeSent ? (
              <div className="space-y-4 rounded-2xl border border-dashed border-border bg-muted/30 p-5">
                <div className="space-y-2">
                  <Label htmlFor="student-code">Code reçu par e-mail</Label>
                  <Input
                    id="student-code"
                    name="student-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Code à 6 chiffres"
                    value={studentCode}
                    onChange={(ev) => setStudentCode(ev.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={studentLoading !== null}
                  className="w-full rounded-full"
                  onClick={() => void handleVerifyStudentCode()}
                >
                  {studentLoading === "verify" ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                      Vérification…
                    </>
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>
              </div>
            ) : null}
          </form>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Après validation, vous choisirez votre mot de passe pour revenir plus tard sans redemander de code.
          </p>
        </section>
      </div>

      <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "-mt-2 inline-flex rounded-full")}>
        Retour à l'accueil
      </Link>
    </div>
  );
}