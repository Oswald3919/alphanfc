/**
 * Shared utility helpers used across the application.
 */

/**
 * Format a number with locale-aware thousands separators.
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  return new Intl.NumberFormat('es-MX').format(n);
}

/**
 * Format a UTC timestamp into a human-readable Spanish date string.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Normalize table code values to a stable uppercase slug.
 * Examples: "Mesa 1" -> "MESA-1" ; "MESA-01" -> "MESA-01"
 */
export function normalizeTableCode(value) {
  const normalized = (value ?? '')
    .toString()
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/g, '-');

  const cleaned = normalized.replace(/^-+|-+$/g, '').replace(/-+/g, '-');
  if (!cleaned) return '';

  return cleaned.length <= 24 ? cleaned : cleaned.slice(0, 24).replace(/-+$/, '');
}

/**
 * Validate general external business URLs.
 */
export function validateBusinessUrl(raw) {
  if (!raw) return false;
  const value = raw.toString().trim();
  if (!value) return false;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate a WhatsApp value from either a phone number or a URL.
 */
export function validateWhatsappUrl(raw) {
  if (!raw) return false;
  const value = raw.toString().trim();
  if (!value) return false;

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      const hasWhatsappHost = host.includes('wa.me') || host.includes('whatsapp.com') || host.includes('api.whatsapp.com');
      const digits = (url.searchParams.get('phone') ?? '').replace(/\D/g, '');
      return hasWhatsappHost && (digits.length >= 8 || url.pathname.length > 1);
    } catch {
      return false;
    }
  }

  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Map an action_type key to its Spanish display label.
 * @param {'google_review'|'menu'|'whatsapp'} type
 * @returns {string}
 */
export function actionLabel(type) {
  const labels = {
    google_review: 'Reseña en Google',
    menu: 'Menú Digital',
    whatsapp: 'WhatsApp',
  };
  return labels[type] ?? type;
}

/**
 * Build a WhatsApp click-to-chat URL, normalizing phone numbers.
 * Accepts formats like: +52 55 1234 5678, 5215512345678, etc.
 * @param {string} raw  Raw WhatsApp URL or phone number stored in DB
 * @returns {string}
 */
export function resolveWhatsAppUrl(raw) {
  if (!raw) return '#';
  // Already a full URL
  if (raw.startsWith('http')) return raw;
  // Strip non-digits and build wa.me link
  const digits = raw.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}
