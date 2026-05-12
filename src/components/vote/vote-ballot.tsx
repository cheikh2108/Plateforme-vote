"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Candidate } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/env";
import { cn } from "@/lib/utils";

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
      const supabase = createClient();
      const { error } = await supabase.rpc("cast_vote", {
        p_election: electionId,
        p_candidate: choice,
      });
      if (error) throw error;
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Confirmation
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Vote enregistré</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Votre choix est anonymisé et ne peut pas être modifié. Conservez votre justificatif institutionnel si exigé par
          le règlement électoral.
        </p>
      </motion.div>
    );
  }

  if (!votingOpen) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center">
        <p className="text-lg font-semibold tracking-tight">Scrutin fermé ou non ouvert</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Le vote est contrôlé par l’administration (fenêtre horaire et indicateur d’ouverture).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <RadioGroup value={choice} onValueChange={setChoice} className="grid gap-5 md:grid-cols-2">
          {candidates.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-3xl border bg-card p-5 shadow-sm transition hover:border-brand/40",
                choice === c.id ? "border-brand ring-1 ring-brand/50" : "border-border",
              )}
            >
              <div className="flex gap-4">
                <RadioGroupItem value={c.id} id={c.id} aria-labelledby={`label-${c.id}`} />
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                  {c.photo_url ? (
                    <Image src={c.photo_url} alt={c.display_name} fill className="object-cover" sizes="80px" />
                  ) : null}
                </div>
                <div className="flex-1 space-y-1">
                  <Label id={`label-${c.id}`} htmlFor={c.id} className="text-lg font-semibold">
                    {c.display_name}
                  </Label>
                  {c.slogan ? <p className="text-sm text-muted-foreground">{c.slogan}</p> : null}
                </div>
              </div>
            </motion.div>
          ))}
      </RadioGroup>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Sélectionnez une liste puis confirmez. Action définitive — aucune modification possible.
        </p>
        <Button
          size="lg"
          className="rounded-full px-10"
          disabled={!choice || busy}
          onClick={() => setConfirmOpen(true)}
        >
          Valider mon bulletin
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-3xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer votre choix ?</AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              Vous allez voter pour <span className="font-semibold text-foreground">{selected?.display_name}</span>.
              Cette action est anonyme et irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Annuler</AlertDialogCancel>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => void confirmVote()}
              disabled={busy}
            >
              Confirmer définitivement
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
