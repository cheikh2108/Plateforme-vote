"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { setResultsPublic, setVotingOpen } from "@/app/admin/actions";

type Props = {
  votingOpen: boolean;
  resultsPublic: boolean;
};

export function AdminToolbar({ votingOpen, resultsPublic }: Props) {
  const [pending, startTransition] = useTransition();

  function handleVoting(checked: boolean) {
    startTransition(async () => {
      try {
        await setVotingOpen(checked);
        toast.success(checked ? "Scrutin ouvert côté système." : "Scrutin fermé.");
      } catch {
        toast.error("Impossible de mettre à jour le scrutin.");
      }
    });
  }

  function handleResults(checked: boolean) {
    startTransition(async () => {
      try {
        await setResultsPublic(checked);
        toast.success(
          checked ? "Publication des résultats activée." : "Résultats détaillés masqués.",
        );
      } catch {
        toast.error("Impossible de mettre à jour la publication.");
      }
    });
  }

  return (
    <div className="grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm md:grid-cols-2">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <Label htmlFor="voting-open" className="text-base font-semibold">
            Ouverture du vote
          </Label>
          <p className="text-sm text-muted-foreground">
            Contrôle l’acceptation des bulletins (fenêtre horaire également vérifiée côté serveur).
          </p>
        </div>
        <Switch
          id="voting-open"
          checked={votingOpen}
          disabled={pending}
          onCheckedChange={handleVoting}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <Label htmlFor="results-public" className="text-base font-semibold">
            Publication résultats détaillés
          </Label>
          <p className="text-sm text-muted-foreground">
            Affiche pourcentages et graphiques sur la page publique après clôture.
          </p>
        </div>
        <Switch
          id="results-public"
          checked={resultsPublic}
          disabled={pending}
          onCheckedChange={handleResults}
        />
      </div>
    </div>
  );
}
