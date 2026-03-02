/**
 * Centralised business constants — single source of truth.
 *
 * Import from `@/lib/constants` whenever you need company info,
 * contact details, business hours, or site-level defaults.
 * Never hard-code these values elsewhere.
 */

/* ------------------------------------------------------------------ */
/*  Company                                                            */
/* ------------------------------------------------------------------ */

export const COMPANY = {
  /** Short trading name */
  name: 'Loading Technology',
  /** Full legal entity name */
  nameFull: 'Loading Technology Company Limited',
  /** Entity name used on formal documents (quotations, invoices) */
  nameEntity: 'Loading Technology Company',
  /** One-line descriptor / tagline */
  tagline: 'Smart Construction Site Safety Solutions',
} as const;

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  /** Raw phone number (E.164 — for `tel:` links) */
  phone: '+85291234567',
  /** Human-readable phone number */
  phoneFormatted: '+852 9123 4567',
  /** General enquiry e-mail */
  email: 'info@loadingtechnology.com',
  /** WhatsApp click-to-chat URL */
  whatsappUrl: 'https://wa.me/85291234567',
  /** Office location (short label) */
  address: 'Hong Kong',
} as const;

/* ------------------------------------------------------------------ */
/*  Business hours                                                     */
/* ------------------------------------------------------------------ */

export const BUSINESS_HOURS = {
  weekday: 'Mon – Fri: 9:00 AM – 6:00 PM',
  saturday: 'Sat: 9:00 AM – 1:00 PM',
  closed: 'Sun & Public Holidays: Closed',
} as const;

/* ------------------------------------------------------------------ */
/*  Site / deployment                                                  */
/* ------------------------------------------------------------------ */

export const SITE = {
  /** Canonical URL (overridden by NEXT_PUBLIC_SITE_URL env var) */
  defaultUrl: 'https://loading-company-portal-mheny.ondigitalocean.app',
  ogLocale: 'zh_HK',
  ogAlternateLocale: 'en_US',
  locales: ['zh', 'en'] as const,
} as const;
