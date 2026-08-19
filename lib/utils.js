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
