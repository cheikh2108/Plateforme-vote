import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getActiveElection,
  getCandidateBySlug,
} from "@/lib/data/elections";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const election = await getActiveElection();
  if (!election) return { title: "Candidat" };
  const candidate = await getCandidateBySlug(election.id, slug);
  if (!candidate) return { title: "Candidat" };
  return {
    title: candidate.display_name,
    description: candidate.summary ?? siteConfig.tagline,
  };
}

export default async function CandidateDetailPage({ params }: Props) {
  const { slug } = await params;
  const election = await getActiveElection();
  if (!election) notFound();

  const candidate = await getCandidateBySlug(election.id, slug);
  if (!candidate) notFound();

  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Link
        href="/candidats"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "-ml-2 mb-10 inline-flex rounded-full text-muted-foreground",
        )}
      >
        <ArrowLeft className="mr-2 size-4" aria-hidden />
        Retour aux candidats
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Liste candidate
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{candidate.display_name}</h1>
            {candidate.slogan ? (
              <p className="text-xl text-muted-foreground">{candidate.slogan}</p>
            ) : null}
          </header>
          {candidate.biography ? (
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {candidate.biography.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          <Separator />
          <section className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Promesses clés</h2>
            <ul className="grid gap-3 text-sm text-muted-foreground">
              {(candidate.promises ?? []).map((p) => (
                <li key={p} className="rounded-2xl border border-border bg-card px-4 py-3">
                  {p}
                </li>
              ))}
            </ul>
          </section>
          {candidate.program_pdf_url ? (
            <a
              href={candidate.program_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "inline-flex rounded-full")}
            >
              Télécharger le programme (PDF)
              <ExternalLink className="ml-2 size-4" aria-hidden />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">
              Programme PDF : disponible lorsque publié par l’administration.
            </p>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[3/4] w-full bg-muted">
              {candidate.photo_url ? (
                <Image
                  src={candidate.photo_url}
                  alt={candidate.display_name}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 400px"
                  className="object-cover"
                />
              ) : null}
            </div>
          </div>

          {(candidate.team ?? []).length > 0 ? (
            <section className="rounded-3xl border border-border bg-muted/40 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Équipe
              </h2>
              <ul className="mt-4 space-y-4">
                {candidate.team.map((m) => (
                  <li key={`${m.name}-${m.role}`}>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(candidate.social_links ?? []).length > 0 ? (
            <section className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Réseaux
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                {candidate.social_links.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium transition hover:border-brand/50"
                  >
                    {s.label}
                    <ExternalLink className="size-4 text-muted-foreground" aria-hidden />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
