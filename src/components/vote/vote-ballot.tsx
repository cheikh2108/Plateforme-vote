"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ShieldCheck, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/types/database";
import { hasSupabase } from "@/lib/env";
import { cn } from "@/lib/utils";
import { castVoteAction } from "@/app/(site)/vote/actions";

type Props = {
  electionId: string;
  candidates: Candidate[];
  initialHasVoted: boolean;
  votingOpen: boolean;
};

export function VoteBallot({
  electionId,
  candidates,
  initialHasVoted,
  votingOpen,
}: Props) {
  const [choice, setChoice] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState(initialHasVoted);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => candidates.find((c) => c.id === choice),
    [candidates, choice],
  );

  async function confirmVote() {
    if (!choice || !selected) return;
    if (!hasSupabase) {
      toast.error("Le vote n'est pas encore prêt sur cette plateforme.");
      return;
    }

    setBusy(true);
    try {
      await castVoteAction(electionId, choice);
      setDone(true);
      setConfirmOpen(false);
      toast.success("Bulletin enregistré — merci pour votre participation.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Impossible de confirmer le bulletin.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-sm"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-estm-blue text-white">
          <CheckCircle2 className="size-7" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">Vote enregistré</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Votre choix est anonymisé et ne peut pas être modifié. Le bulletin est séparé de votre identité dans notre base de données.
        </p>
        <Link
          href="/resultats"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-estm-blue hover:underline underline-offset-2"
        >
          Suivre la participation
          <ChevronRight className="size-4" />
        </Link>
      </motion.div>
    );
  }

  if (!votingOpen) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <p className="text-base font-semibold tracking-tight">Scrutin non ouvert</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Le vote est contrôlé par l&apos;administration. Revenez quand le scrutin sera ouvert.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mention anonymat */}
      <div className="flex items-center gap-2.5 rounded-xl border border-estm-blue/20 bg-estm-blue-light px-4 py-3 text-sm text-estm-blue">
        <ShieldCheck className="size-4 shrink-0" />
        Votre identité n&apos;est pas liée à votre bulletin. Le vote est définitif et irréversible.
      </div>

      {/* Grille candidats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((c) => {
          const isSelected = choice === c.id;
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => setChoice(c.id)}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200",
                isSelected
                  ? "border-estm-blue bg-card shadow-md ring-1 ring-estm-blue/20"
                  : "border-border bg-card hover:border-estm-blue/30 hover:shadow-sm",
              )}
              aria-pressed={isSelected}
            >
              {/* Photo */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
                {c.photo_url ? (
                  <Image
                    src={c.photo_url}
                    alt={c.display_name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Photo à venir
                  </div>
                )}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-estm-blue/8"
                    />
                  )}
                </AnimatePresence>
                {/* Badge sélection */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-estm-blue text-white shadow"
                    >
                      <CheckCircle2 className="size-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Infos */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-semibold text-foreground">{c.display_name}</p>
                {c.slogan ? (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{c.slogan}</p>
                ) : null}
                <Link
                  href={`/candidats/${c.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Info className="size-3" />
                  Voir le programme
                </Link>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {choice
            ? `Vous avez sélectionné "${selected?.display_name}". Cliquez sur Valider pour confirmer.`
            : "Sélectionnez un candidat pour activer le bouton de validation."}
        </p>
        <Button
          size="lg"
          className="rounded-full px-10 sm:shrink-0"
          disabled={!choice || busy}
          onClick={() => setConfirmOpen(true)}
        >
          Valider mon bulletin
          <ChevronRight className="ml-1.5 size-4" />
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirmer votre choix ?</AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              Vous allez voter pour{" "}
              <span className="font-semibold text-foreground">{selected?.display_name}</span>.
              Cette action est <strong>anonyme et irréversible</strong> — aucune modification possible après confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full">Annuler</AlertDialogCancel>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => void confirmVote()}
              disabled={busy}
            >
              {busy ? "Enregistrement…" : "Confirmer définitivement"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
