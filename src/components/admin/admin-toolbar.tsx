"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { setResultsPublic, setVotingOpen } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

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
        toast.success(checked ? "Scrutin ouvert." : "Scrutin fermé.");
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
          checked ? "Résultats publiés." : "Résultats masqués.",
        );
      } catch {
        toast.error("Impossible de mettre à jour la publication.");
      }
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ControlCard
        id="voting-open"
        label="Ouverture du vote"
        description="Autorise l'enregistrement de nouveaux bulletins."
        checked={votingOpen}
        disabled={pending}
        onCheckedChange={handleVoting}
        activeColor="bg-foreground"
      />
      <ControlCard
        id="results-public"
        label="Publication des résultats"
        description="Affiche les pourcentages sur la page publique."
        checked={resultsPublic}
        disabled={pending}
        onCheckedChange={handleResults}
        activeColor="bg-foreground"
      />
    </div>
  );
}

function ControlCard({
  id,
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (v: boolean) => void;
  activeColor?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
        checked ? "border-foreground/30 bg-card" : "border-border bg-muted/30",
      )}
    >
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-semibold">
          {label}
        </Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Switch
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
        />
        <span className={cn("text-[10px] font-medium", checked ? "text-foreground" : "text-muted-foreground")}>
          {checked ? "Actif" : "Inactif"}
        </span>
      </div>
    </div>
  );
}
