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
  variant = 'primary',
  compact = false,
  showLabel = true,
}) {
  const Icon = iconMap[icon] || Star;

  const isCompact = variant === 'social' || compact;

  const buttonStyle = isCompact
    ? {
        width: '48px',
        height: '48px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}40`,
        borderRadius: '14px',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'transform 150ms ease, border-color 150ms ease, background 150ms ease',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.02)',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }
    : {
        width: '100%',
        minHeight: '62px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        padding: '1rem 1.15rem',
        background: variant === 'menu' ? 'linear-gradient(135deg, rgba(255, 129, 38, 0.20), rgba(255, 104, 0, 0.08))' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}50`,
        borderRadius: '18px',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'transform 150ms ease, border-color 150ms ease, background 150ms ease',
        textAlign: 'left',
        boxShadow: variant === 'menu' ? `0 0 0 1px ${color}30, 0 12px 30px rgba(255, 110, 0, 0.10)` : '0 0 0 1px rgba(255,255,255,0.02)',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      };

  return (
    <form action={trackAction} target={actionType === 'menu' ? '_blank' : undefined} style={{ width: isCompact ? 'auto' : '100%' }}>
      <input type="hidden" name="tableId" value={tableId} />
      <input type="hidden" name="actionType" value={actionType} />
      <input type="hidden" name="redirectUrl" value={redirectUrl} />

      <button type="submit" style={buttonStyle} aria-label={label} title={label}>
        {isCompact ? (
          <Icon size={18} strokeWidth={2.1} color={color} />
        ) : (
          <>
            <span style={{
              width: '46px', height: '46px',
              borderRadius: '14px',
              background: `${color}18`,
              border: `1px solid ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: color,
            }}>
              <Icon size={19} strokeWidth={2} />
            </span>

            {showLabel && <span style={{ flex: 1 }}>{label}</span>}
            <span style={{ color, opacity: 0.9, fontSize: '1.1rem' }}>→</span>
          </>
        )}
      </button>
    </form>
  );
}
