"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Candidate } from "@/types/database";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Props = {
  candidate: Candidate;
};

export function CandidateCard({ candidate }: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {candidate.photo_url ? (
          <Image
            src={candidate.photo_url}
            alt={candidate.display_name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Photo à venir
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">{candidate.display_name}</h2>
          {candidate.slogan ? (
            <p className="text-sm text-muted-foreground">{candidate.slogan}</p>
          ) : null}
        </div>
        {candidate.summary ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{candidate.summary}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-2">
          {(candidate.promises ?? []).slice(0, 3).map((p) => (
            <span
              key={p}
              className="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
        <Link
          href={`/candidats/${candidate.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-2 inline-flex w-full justify-between rounded-full",
          )}
        >
          Programme détaillé
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
}
