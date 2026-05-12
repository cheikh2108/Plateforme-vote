import type { Candidate, Election, ElectionStats, School } from "@/types/database";
import { siteConfig } from "@/config/site";

const demoSchool: School = {
  id: "00000000-0000-0000-0000-000000000001",
  slug: siteConfig.schoolSlug,
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  logo_url: null,
  branding: {
    accent: siteConfig.accent,
    surface: siteConfig.surface,
    heroStatement: siteConfig.heroStatement,
  },
};

const opens = new Date();
opens.setDate(opens.getDate() - 1);
const closes = new Date();
closes.setDate(closes.getDate() + 14);

export const demoElection: Election = {
  id: "00000000-0000-0000-0000-000000000002",
  school_id: demoSchool.id,
  title: "Élection du bureau des étudiants",
  description:
    "Démonstration hors ligne — connectez Supabase pour les données réelles.",
  opens_at: opens.toISOString(),
  closes_at: closes.toISOString(),
  voting_open: true,
  results_public: false,
  eligible_email_suffix: `@${siteConfig.allowedEmailDomain}`,
};

export const demoStats: ElectionStats = {
  election_id: demoElection.id,
  participation_count: 428,
  updated_at: new Date().toISOString(),
};

export const demoCandidates: Candidate[] = [
  {
    id: "00000000-0000-0000-0000-000000000011",
    election_id: demoElection.id,
    slug: "aminata-diallo",
    display_name: "Aminata Diallo",
    slogan: "Ensemble, construire",
    summary:
      "Une liste tournée vers l’écoute, la transparence et la médiation.",
    biography:
      "Engagée dans les instances étudiantes, Aminata porte une vision de proximité et de résultats mesurables.",
    photo_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    program_pdf_url: null,
    social_links: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "LinkedIn", url: "https://linkedin.com" },
    ],
    team: [
      { name: "Lamine Sow", role: "Trésorerie" },
      { name: "Fatou Ka", role: "Communication" },
    ],
    promises: [
      "Wi‑Fi campus renforcé",
      "Médiation étudiants–administration",
      "Événements inter-promotions",
    ],
    sort_order: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    election_id: demoElection.id,
    slug: "karim-faye",
    display_name: "Karim Faye",
    slogan: "Cap sur l’action",
    summary: "Priorité aux infrastructures et à la vie quotidienne sur le campus.",
    biography:
      "Karim met l’accent sur l’exécution : budgets suivis, délais tenus, reporting accessible.",
    photo_url:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80",
    program_pdf_url: null,
    social_links: [{ label: "X", url: "https://x.com" }],
    team: [{ name: "Ndeye Sarr", role: "Logistique" }],
    promises: [
      "Salles de travail étendues",
      "Bus étudiants renforcés",
      "Sport & bien‑être",
    ],
    sort_order: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    election_id: demoElection.id,
    slug: "salma-niang",
    display_name: "Salma Niang",
    slogan: "Voix & diversité",
    summary: "Inclusion, équité et communication ouverte.",
    biography:
      "Pour une instance qui reflète la diversité des parcours et facilite l’accès à l’information.",
    photo_url:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=80",
    program_pdf_url: null,
    social_links: [],
    team: [],
    promises: [
      "Communication multilingue",
      "Mentorat entre promotions",
      "Égalité des chances",
    ],
    sort_order: 3,
  },
];

export function getDemoSchool(): School {
  return demoSchool;
}
