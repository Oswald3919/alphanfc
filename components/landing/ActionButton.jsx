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
    <BaseSvg size={size} viewBox="0 0 24 24">
      <path d="M21.8 12.23c0-.8-.07-1.57-.2-2.31H12v4.37h5.4a4.62 4.62 0 0 1-2 3.03v2.52h3.23c1.9-1.75 2.97-4.34 2.97-7.61Z" fill="#4285F4" />
      <path d="M12 21.6c2.7 0 4.96-.9 6.62-2.43l-3.23-2.52c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.75-5.58-4.1H.8v2.6A9.6 9.6 0 0 0 12 21.6Z" fill="#34A853" />
      <path d="M6.42 17.5A5.8 5.8 0 0 1 6.1 15v-2.6H2.9A9.64 9.64 0 0 0 2.4 12c0 1.56.37 3.04 1.04 4.35l2.98-1.85Z" fill="#FBBC05" />
      <path d="M12 4.1c1.5 0 2.8.52 3.85 1.54l2.88-2.88A9.6 9.6 0 0 0 12 2.4a9.6 9.6 0 0 0-9.2 6.5l3.3 2.6c.78-2.35 2.98-4.1 5.58-4.1Z" fill="#EA4335" />
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

function WhatsAppIcon({ size = 20 }) {
  return (
    <BaseSvg size={size}>
      <path d="M20.16 11.42A8.17 8.17 0 0 1 4.86 18l-1.2 4.4 4.52-1.18a8.17 8.17 0 1 0 12-9.8Z" fill="#25D366" />
      <path d="M15.97 14.8c-.22-.11-1.3-.64-1.5-.72-.2-.08-.35-.11-.5.11-.15.22-.58.72-.71.87-.13.15-.27.17-.5.06-.22-.11-.94-.35-1.79-1.12-.66-.59-1.1-1.33-1.23-1.55-.13-.22-.01-.34.1-.45.1-.1.22-.27.33-.41.11-.14.15-.24.23-.41.08-.17.04-.32-.02-.44-.06-.11-.5-1.22-.7-1.67-.18-.43-.37-.38-.5-.38h-.43c-.15 0-.4.06-.6.28-.2.22-.77.75-.77 1.84s.8 2.13.91 2.28c.11.15 1.56 2.48 3.8 3.46.53.23.94.36 1.26.46.53.17 1.02.14 1.4.09.43-.06 1.3-.53 1.49-1.04.19-.5.19-.94.13-1.03-.05-.1-.2-.16-.42-.27Z" fill="#fff" />
    </BaseSvg>
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
