import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustStrip } from "@/components/landing/trust-strip";
import { StatsStrip } from "@/components/landing/stats-strip";
import { FeaturesSection } from "@/components/landing/features-section";
import { SecuritySection } from "@/components/landing/security-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { CountdownSection } from "@/components/landing/countdown-section";
import {
  getActiveElection,
  getCandidates,
  getElectionStats,
} from "@/lib/data/elections";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.shortName} · Plateforme électorale étudiante`,
  description: siteConfig.tagline,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const election = await getActiveElection();
  const candidates = election ? await getCandidates(election.id) : [];
  const stats = election ? await getElectionStats(election.id) : null;

  const closesAt = election ? new Date(election.closes_at) : new Date();
  const closesAtText = closesAt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <HeroSection closesAtText={closesAtText} />
      <TrustStrip />
      <CountdownSection target={closesAt} />
      <StatsStrip
        participation={stats?.participation_count ?? 0}
        candidates={candidates.length}
      />
      <FeaturesSection />
      <SecuritySection />
      <HowItWorks />
      <FaqSection />
      <CtaSection />
    </>
  );
}
