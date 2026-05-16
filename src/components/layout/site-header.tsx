"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/candidats", label: "Candidats" },
  { href: "/resultats", label: "Résultats" },
  { href: "/vote", label: "Voter" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const load = () =>
      supabase.auth
        .getUser()
        .then(({ data: { user } }) => setAuthenticated(Boolean(user)))
        .catch(() => setAuthenticated(false));

    void load();
    const { data } = supabase.auth.onAuthStateChange(() => void load());
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo — typographique */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {siteConfig.shortName}
          </span>
          <span className="hidden text-[11px] text-muted-foreground sm:block">
            · Plateforme électorale
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navigation">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          {authenticated === null ? null : authenticated ? (
            <UserProfileMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/auth/login"
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
              >
                Connexion
              </Link>
              <Link
                href="/vote"
                className="rounded-full bg-estm-blue px-4 py-1.5 text-sm font-medium text-white transition hover:bg-estm-blue-hover"
              >
                Voter
              </Link>
            </div>
          )}

          {/* Burger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,300px)]">
              <SheetHeader>
                <SheetTitle className="text-left text-sm">{siteConfig.shortName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {[{ href: "/", label: "Accueil" }, ...links].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                {authenticated ? (
                  <UserProfileMenu className="w-full" />
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-estm-blue px-4 py-3 text-center text-sm font-medium text-white"
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
