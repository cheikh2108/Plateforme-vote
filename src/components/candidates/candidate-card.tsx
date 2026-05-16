"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Candidate } from "@/types/database";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ImageOff } from "lucide-react";

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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      {/* Photo zone */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {candidate.photo_url ? (
          <Image
            src={candidate.photo_url}
            alt={candidate.display_name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <ImageOff className="size-8" />
            <span className="text-xs">Photo à venir</span>
          </div>
        )}
        {/* Subtle bottom fade — just enough to separate content, no muddy gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold leading-tight tracking-tight">{candidate.display_name}</h2>
          {candidate.slogan ? (
            <p className="text-sm italic text-muted-foreground">« {candidate.slogan} »</p>
          ) : null}
        </div>

        {candidate.summary ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{candidate.summary}</p>
        ) : null}

        {/* Promise pills */}
        {(candidate.promises ?? []).length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {(candidate.promises ?? []).slice(0, 3).map((p) => (
              <span
                key={p}
                className="rounded-full border border-estm-blue/20 bg-estm-blue-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-estm-blue"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/candidats/${candidate.slug}`}
          className={cn(
            "mt-auto inline-flex w-full items-center justify-between rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-estm-blue/40 hover:bg-estm-blue-light hover:text-estm-blue",
          )}
        >
          Programme détaillé
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
}
