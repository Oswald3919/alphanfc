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

function BaseSvg({ children, size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      {children}
    </svg>
  );
}

function GoogleIcon({ size = 20 }) {
  return (
    <BaseSvg size={size} viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </BaseSvg>
  );
}

function MenuIcon({ size = 20 }) {
  return (
    <BaseSvg size={size} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="M8 8.5h8M8 12h8M8 15.5h5" />
    </BaseSvg>
  );
}

function WhatsAppIcon({ size = 22, color = '#25D366' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ color, display: 'inline-block', verticalAlign: 'middle' }}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.987 2.894a9.825 9.825 0 012.882 6.99c-.002 5.45-4.437 9.884-9.877 9.884" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }) {
  return (
    <BaseSvg size={size}>
      <defs>
        <linearGradient id="igGradient" x1="2" y1="20" x2="22" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F58529" />
          <stop offset="0.5" stopColor="#DD2A7B" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" fill="none" stroke="url(#igGradient)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#igGradient)" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.3" fill="url(#igGradient)" />
    </BaseSvg>
  );
}

function FacebookIcon({ size = 20 }) {
  return (
    <BaseSvg size={size}>
      <path d="M13.8 21.2v-8.1h2.7l.4-3.1h-3.1V7.4c0-.9.3-1.5 1.5-1.5h1.7V2.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4.1v2.2H8.2v3.1h2.6v8.1h3Z" fill="#1877F2" />
    </BaseSvg>
  );
}

function TikTokIcon({ size = 20 }) {
  return (
    <BaseSvg size={size}>
      <defs>
        <linearGradient id="ttGradient" x1="5" y1="18" x2="17" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F2EA" />
          <stop offset="1" stopColor="#FF0050" />
        </linearGradient>
      </defs>
      <path d="M14.8 3.2c.8 1.7 2.3 2.7 4.2 3v2.6c-1.6-.1-3.1-.8-4.2-1.9v7.2c0 3.2-2.6 5.8-5.8 5.8s-5.8-2.6-5.8-5.8 2.6-5.8 5.8-5.8c.6 0 1.2.1 1.7.3v2.7c-.5-.2-1.1-.3-1.7-.3-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V3.2h2.8Z" fill="url(#ttGradient)" />
    </BaseSvg>
  );
}

function GlobeIcon({ size = 20 }) {
  return (
    <BaseSvg size={size} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M3 12h18M12 4a13.5 13.5 0 0 1 0 16M12 4a13.5 13.5 0 0 0 0 16" />
    </BaseSvg>
  );
}

function PhoneIcon({ size = 20 }) {
  return (
    <BaseSvg size={size} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 4.5h3l1.2 4.4-1.8 1.7a14.2 14.2 0 0 0 6.3 6.3l1.7-1.8 4.4 1.2v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 6.5a2 2 0 0 1 2-2Z" />
    </BaseSvg>
  );
}

const iconMap = {
  star: GoogleIcon,
  fileText: MenuIcon,
  messageCircle: WhatsAppIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  globe: GlobeIcon,
  phone: PhoneIcon,
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
  const Icon = iconMap[icon] || GoogleIcon;

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
          <Icon size={18} color={color} />
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
              <Icon size={19} color={color} />
            </span>

            {showLabel && <span style={{ flex: 1 }}>{label}</span>}
            <span style={{ color, opacity: 0.9, fontSize: '1.1rem' }}>→</span>
          </>
        )}
      </button>
    </form>
  );
}
