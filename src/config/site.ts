/**
 * Configuration marque / tenant — pilotée par variables d’environnement.
 * Aucune logique codée en dur pour une école précise : ESTM n’est que la valeur par défaut.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Eligo · ESTM",
  shortName: process.env.NEXT_PUBLIC_SCHOOL_SHORT_NAME ?? "Eligo",
  tagline:
    process.env.NEXT_PUBLIC_SCHOOL_TAGLINE ??
    "Gouvernance étudiante — vote vérifié, anonyme et traçable.",
  heroStatement:
    process.env.NEXT_PUBLIC_HERO_STATEMENT ??
    "La plateforme électorale de votre campus.",
  domainHint: process.env.NEXT_PUBLIC_DOMAIN_HINT ?? "eligo.estm.sn",
  /** Domaine email autorisé pour voter (sans @) */
  allowedEmailDomain:
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN ?? "estm.edu.sn",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Identifiant école côté base (multi-tenant) */
  schoolSlug: process.env.NEXT_PUBLIC_SCHOOL_SLUG ?? "estm",
  accent: process.env.NEXT_PUBLIC_BRAND_ACCENT ?? "#a67c52",
  accentMuted: process.env.NEXT_PUBLIC_BRAND_ACCENT_MUTED ?? "#8b6914",
  surface: process.env.NEXT_PUBLIC_BRAND_SURFACE ?? "#faf8f5",
} as const;

export function isAllowedStudentEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const suffix = `@${siteConfig.allowedEmailDomain.toLowerCase()}`;
  return normalized.endsWith(suffix);
}
