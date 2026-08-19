/**
 * ActionButton — CTA button on the visitor landing page.
 *
 * Wraps a <form> that posts to the `trackAndRedirect` Server Action.
 * Using a form (not a link) means:
 *  - The click is tracked server-side before redirecting.
 *  - Works without client-side JavaScript (progressive enhancement).
 *
 * Hidden inputs carry the tracking payload; the button submits the form.
 */

'use client';

import { BadgeCheck, Camera, FileText, Globe, MessageCircle, Music2, Phone, Star } from 'lucide-react';

const iconMap = {
  star: Star,
  fileText: FileText,
  messageCircle: MessageCircle,
  instagram: Camera,
  facebook: BadgeCheck,
  tiktok: Music2,
  globe: Globe,
  phone: Phone,
};

export default function ActionButton({
  tableId,
  actionType,
  redirectUrl,
  icon,
  label,
  color,
  trackAction,
}) {
  const Icon = iconMap[icon] || Star;

  return (
    <form action={trackAction} target={actionType === 'menu' ? '_blank' : undefined}>
      <input type="hidden" name="tableId" value={tableId} />
      <input type="hidden" name="actionType" value={actionType} />
      <input type="hidden" name="redirectUrl" value={redirectUrl} />

      <button
        type="submit"
        style={{
          width: '100%',
          minHeight: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'var(--surface-2)',
          border: `1px solid ${color}40`,
          borderRadius: 'var(--radius-none)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          boxShadow: `0 0 0 1px ${color}30`,
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${color}12`;
          e.currentTarget.style.borderColor = `${color}90`;
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = `0 0 0 1px ${color}80`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--surface-2)';
          e.currentTarget.style.borderColor = `${color}40`;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 0 0 1px ${color}30`;
        }}
      >
        <span style={{
          width: '44px', height: '44px',
          borderRadius: '0',
          background: `${color}18`,
          border: `1px solid ${color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          color: color,
        }}>
          <Icon size={18} strokeWidth={2} />
        </span>

        <span style={{ flex: 1 }}>{label}</span>
        <span style={{ color: color, opacity: 0.9, fontSize: '1.1rem' }}>→</span>
      </button>
    </form>
  );
}
