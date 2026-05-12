export type UserRole = "voter" | "admin";

export type School = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  logo_url: string | null;
  branding: Record<string, unknown>;
};

export type Election = {
  id: string;
  school_id: string;
  title: string;
  description: string | null;
  opens_at: string;
  closes_at: string;
  voting_open: boolean;
  results_public: boolean;
  eligible_email_suffix: string;
};

export type Candidate = {
  id: string;
  election_id: string;
  slug: string;
  display_name: string;
  slogan: string | null;
  summary: string | null;
  biography: string | null;
  photo_url: string | null;
  program_pdf_url: string | null;
  social_links: SocialLink[];
  team: TeamMember[];
  promises: string[];
  sort_order: number;
};

export type SocialLink = { label: string; url: string };

export type TeamMember = { name: string; role: string };

export type ElectionStats = {
  election_id: string;
  participation_count: number;
  updated_at: string;
};
