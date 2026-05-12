"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type VariantProps } from "class-variance-authority";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  redirectTo?: string;
  label?: string;
  onSuccess?: () => void;
};

export function LogoutButton({
  className,
  variant = "outline",
  size = "sm",
  redirectTo = "/",
  label = "Déconnexion",
  onSuccess,
}: Props) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Impossible de fermer la session.");
      return;
    }

    onSuccess?.();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => void handleLogout()}
      className={cn("rounded-full", className)}
    >
      {label}
    </Button>
  );
}