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
  tagline: 'Smart Construction Site Solutions',
} as const;

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  /** Raw phone number (E.164 — for `tel:` links) */
  phone: '+85261099058',
  /** Human-readable phone number */
  phoneFormatted: '+852 6109 9058',
  /** General enquiry e-mail */
  email: 'charlesloading1997@gmail.com',
  /** WhatsApp click-to-chat URL */
  whatsappUrl: 'https://wa.me/message/UTHIVKL44GDPL1',
  /** Office location (short label) */
  address: 'Tuen Mun, Hong Kong',
} as const;

/* ------------------------------------------------------------------ */
/*  Business hours                                                     */
/* ------------------------------------------------------------------ */

export const BUSINESS_HOURS = {
  weekday: 'Mon – Fri: 8:30 AM – 5:30 PM',
  saturday: '',
  closed: 'Sat, Sun & Public Holidays: Closed',
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
