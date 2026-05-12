"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/logout-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/candidats", label: "Candidats" },
  { href: "/resultats", label: "Participation" },
  { href: "/vote", label: "Voter" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => setAuthenticated(Boolean(user)))
      .catch(() => setAuthenticated(false));

    const { data } = supabase.auth.onAuthStateChange(() => {
      supabase.auth
        .getUser()
        .then(({ data: { user } }) => setAuthenticated(Boolean(user)))
        .catch(() => setAuthenticated(false));
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <motion.span
            layout
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold tracking-tight text-foreground"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            {siteConfig.shortName.slice(0, 2).toUpperCase()}
          </motion.span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">{siteConfig.shortName}</p>
            <p className="text-[11px] text-muted-foreground">{siteConfig.domainHint}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {authenticated === null ? null : authenticated ? (
            <LogoutButton className="hidden sm:inline-flex" />
          ) : (
            <Link
              href="/auth/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden sm:inline-flex rounded-full",
              )}
            >
              Connexion
            </Link>
          )}
          <Link
            href="/vote"
            className={cn(buttonVariants({ size: "sm" }), "hidden rounded-full sm:inline-flex")}
          >
            Espace vote
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,320px)]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-border px-4 py-3 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {authenticated === null ? null : authenticated ? (
                  <LogoutButton
                    className="mt-4 w-full"
                    variant="default"
                    size="default"
                    label="Déconnexion"
                    onSuccess={() => setOpen(false)}
                  />
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "mt-4 rounded-full text-center")}
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
