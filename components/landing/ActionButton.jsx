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

export default function ActionButton({
  tableId,
  actionType,
  redirectUrl,
  icon,
  label,
  color,
  trackAction,
}) {
  return (
    <form action={trackAction}>
      {/* Hidden tracking payload */}
      <input type="hidden" name="tableId"     value={tableId} />
      <input type="hidden" name="actionType"  value={actionType} />
      <input type="hidden" name="redirectUrl" value={redirectUrl} />

      <button
        type="submit"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'var(--surface-2)',
          border: `1px solid ${color}30`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          boxShadow: `0 4px 20px ${color}15`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${color}18`;
          e.currentTarget.style.borderColor = `${color}60`;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 28px ${color}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--surface-2)';
          e.currentTarget.style.borderColor = `${color}30`;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 20px ${color}15`;
        }}
      >
        {/* Colored icon circle */}
        <span style={{
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: `${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.35rem',
          flexShrink: 0,
        }}>
          {icon}
        </span>

        <span style={{ flex: 1 }}>{label}</span>

        {/* Arrow indicator */}
        <span style={{ color: color, opacity: 0.8, fontSize: '1.1rem' }}>→</span>
      </button>
    </form>
  );
}
